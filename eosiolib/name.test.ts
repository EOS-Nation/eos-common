import { name, Name } from "../dist";
import bigInt from "big-integer";

// const u64min = 0n;
const u64max = bigInt("18446744073709551615");

test("name::from", () => {
   expect( Name.from("foobar").toString() ).toBe("foobar");
});

test("name", () => {
   //// constexpr name()
   expect( name().value).toStrictEqual( bigInt(0) )

   //// constexpr explicit name(uint64_t)
   expect( name(0).value).toStrictEqual( bigInt(0) )
   expect( name(1).value).toStrictEqual( bigInt(1) )
   expect( name(u64max).value).toStrictEqual( u64max )

   //// constexpr explicit name(string_view)
   // Note:
   // These are the exact `uint64_t` value representations of the given string
   expect( name("1").value).toStrictEqual( bigInt("576460752303423488") )
   expect( name("5").value).toStrictEqual( bigInt("2882303761517117440") )
   expect( name("a").value).toStrictEqual( bigInt("3458764513820540928") )
   expect( name("z").value).toStrictEqual( bigInt("17870283321406128128") )


   expect( name("abc").value ).toStrictEqual( bigInt("3589368903014285312") )
   expect( name("123").value ).toStrictEqual( bigInt("614178399182651392") )

   expect( name(".abc").value ).toStrictEqual( bigInt("112167778219196416") )
   expect( name(".........abc").value ).toStrictEqual( bigInt("102016") )
   expect( name("123.").value ).toStrictEqual( bigInt("614178399182651392") )
   expect( name("123.........").value ).toStrictEqual( bigInt("614178399182651392") )
   expect( name(".a.b.c.1.2.3.").value ).toStrictEqual( bigInt("108209673814966320") )

   expect( name("abc.123").value ).toStrictEqual( bigInt("3589369488740450304") )
   expect( name("123.abc").value ).toStrictEqual( bigInt("614181822271586304") )

   expect( name("12345abcdefgj").value ).toStrictEqual( bigInt("614251623682315983") )
   expect( name("hijklmnopqrsj").value ).toStrictEqual( bigInt("7754926748989239183") )
   expect( name("tuvwxyz.1234j").value ).toStrictEqual( bigInt("14895601873741973071") )

   expect( name("111111111111j").value ).toStrictEqual( bigInt("595056260442243615") )
   expect( name("555555555555j").value ).toStrictEqual( bigInt("2975281302211218015") )
   expect( name("aaaaaaaaaaaaj").value ).toStrictEqual( bigInt("3570337562653461615") )
   expect( name("zzzzzzzzzzzzj").value ).toStrictEqual( u64max )

   expect( () => name("-1") ).toThrow("character is not in allowed character set for names");
   expect( () => name("0") ).toThrow("character is not in allowed character set for names");
   expect( () => name("6") ).toThrow("character is not in allowed character set for names");
   expect( () => name("111111111111k") ).toThrow("thirteenth character in name cannot be a letter that comes after j");
   expect( () => name("zzzzzzzzzzzzk") ).toThrow("thirteenth character in name cannot be a letter that comes after j");
   expect( () => name("12345abcdefghj") ).toThrow("string is too long to be a valid name");

   // --------------------------------------------
   // static constexpr uint8_t char_to_value(char)
   let c = '.';
   let expected_value = 0; // Will increment to the expected correct value in the set [0,32)
   expect( Name.char_to_value(c) ).toBe( expected_value )
   ++expected_value;

   for (c = '1'; c <= '5'; c = String.fromCharCode(c.charCodeAt(0) + 1 )) {
      expect( Name.char_to_value(c) ).toBe( expected_value )
      ++expected_value;
   }

   for (c = 'a'; c <= 'z'; c = String.fromCharCode(c.charCodeAt(0) + 1 )) {
      expect( Name.char_to_value(c) ).toBe( expected_value )
      ++expected_value;
   }

   expect( () => Name.char_to_value('-')).toThrow("character is not in allowed character set for names");
   expect( () => Name.char_to_value('/')).toThrow("character is not in allowed character set for names");
   expect( () => Name.char_to_value('6')).toThrow("character is not in allowed character set for names");
   expect( () => Name.char_to_value('A')).toThrow("character is not in allowed character set for names");
   expect( () => Name.char_to_value('Z')).toThrow("character is not in allowed character set for names");
   expect( () => Name.char_to_value('`')).toThrow("character is not in allowed character set for names");
   expect( () => Name.char_to_value('{')).toThrow("character is not in allowed character set for names");

   // -------------------------------
   // constexpr uint8_t length()cosnt
   expect( name("").length() ).toBe( 0 );
   expect( name("e").length() ).toBe( 1 );
   expect( name("eo").length() ).toBe( 2 );
   expect( name("eos").length() ).toBe( 3 );
   expect( name("eosi").length() ).toBe( 4 );
   expect( name("eosio").length() ).toBe( 5 );
   expect( name("eosioa").length() ).toBe( 6 );
   expect( name("eosioac").length() ).toBe( 7 );
   expect( name("eosioacc").length() ).toBe( 8 );
   expect( name("eosioacco").length() ).toBe( 9 );
   expect( name("eosioaccou").length() ).toBe( 10 );
   expect( name("eosioaccoun").length() ).toBe( 11 );
   expect( name("eosioaccount").length() ).toBe( 12 );
   expect( name("eosioaccountj").length() ).toBe( 13 );

   expect( () => name("12345abcdefghj").length() ).toThrow("string is too long to be a valid name")

   // ----------------------------
   // constexpr name suffix()const
   expect( name(".eosioaccounj").suffix().isEqual( name("eosioaccounj") )).toBeTruthy()
   expect( name("e.osioaccounj").suffix().isEqual( name("osioaccounj") )).toBeTruthy()
   expect( name("eo.sioaccounj").suffix().isEqual( name("sioaccounj") )).toBeTruthy()
   expect( name("eos.ioaccounj").suffix().isEqual( name("ioaccounj") )).toBeTruthy()
   expect( name("eosi.oaccounj").suffix().isEqual( name("oaccounj") )).toBeTruthy()
   expect( name("eosio.accounj").suffix().isEqual( name("accounj") )).toBeTruthy()
   expect( name("eosioa.ccounj").suffix().isEqual( name("ccounj") )).toBeTruthy()
   expect( name("eosioac.counj").suffix().isEqual( name("counj") )).toBeTruthy()
   expect( name("eosioacc.ounj").suffix().isEqual( name("ounj") )).toBeTruthy()
   expect( name("eosioacco.unj").suffix().isEqual( name("unj") )).toBeTruthy()
   expect( name("eosioaccou.nj").suffix().isEqual( name("nj") )).toBeTruthy()
   expect( name("eosioaccoun.j").suffix().isEqual( name("j") )).toBeTruthy()

   expect( name("e.o.s.i.o.a.c").suffix().isEqual( name("c") )).toBeTruthy()
   expect( name("eos.ioa.cco").suffix().isEqual( name("cco") )).toBeTruthy()


   // -----------------------------
   // constexpr operator raw()const
   expect( name("1").raw() ).toStrictEqual( bigInt("576460752303423488") )
   expect( name("5").raw() ).toStrictEqual( bigInt("2882303761517117440") )
   expect( name("a").raw() ).toStrictEqual( bigInt("3458764513820540928") )
   expect( name("z").raw() ).toStrictEqual( bigInt("17870283321406128128") )

   expect( name("abc").raw() ).toStrictEqual( bigInt("3589368903014285312") )
   expect( name("123").raw() ).toStrictEqual( bigInt("614178399182651392") )

   expect( name(".abc").raw() ).toStrictEqual( bigInt("112167778219196416") )
   expect( name(".........abc").raw() ).toStrictEqual( bigInt("102016") )
   expect( name("123.").raw() ).toStrictEqual( bigInt("614178399182651392") )
   expect( name("123.........").raw() ).toStrictEqual( bigInt("614178399182651392") )
   expect( name(".a.b.c.1.2.3.").raw() ).toStrictEqual( bigInt("108209673814966320") )

   expect( name("abc.123").raw() ).toStrictEqual( bigInt("3589369488740450304") )
   expect( name("123.abc").raw() ).toStrictEqual( bigInt("614181822271586304") )

   expect( name("12345abcdefgj").raw() ).toStrictEqual( bigInt("614251623682315983") )
   expect( name("hijklmnopqrsj").raw() ).toStrictEqual( bigInt("7754926748989239183") )
   expect( name("tuvwxyz.1234j").raw() ).toStrictEqual( bigInt("14895601873741973071") )

   expect( name("111111111111j").raw() ).toStrictEqual( bigInt("595056260442243615") )
   expect( name("555555555555j").raw() ).toStrictEqual( bigInt("2975281302211218015") )
   expect( name("aaaaaaaaaaaaj").raw() ).toStrictEqual( bigInt("3570337562653461615") )
   expect( name("zzzzzzzzzzzzj").raw() ).toStrictEqual( u64max )

   // ---------------------------------------
   // constexpr explicit operator bool()const
   // Note that I must be explicit about calling the operator because it is defined as `explicit`
   expect( name(0).bool() ).toBeFalsy()
   expect( name(1).bool() ).toBeTruthy()
   expect( !name(0).bool() ).toBeTruthy()
   expect( !name(1).bool() ).toBeFalsy()

   expect( name("").bool() ).toBeFalsy()
   expect( name("1").bool() ).toBeTruthy()
   expect( !name("").bool() ).toBeTruthy()
   expect( !name("1").bool() ).toBeFalsy()

   // -----------------------
   // string to_string()const
   expect( name("1").to_string() ).toBe( "1" )
   expect( name("5").to_string() ).toBe( "5" )
   expect( name("a").to_string() ).toBe( "a" )
   expect( name("z").to_string() ).toBe( "z" )

   expect( name("abc").to_string() ).toBe( "abc" )
   expect( name("123").to_string() ).toBe( "123" )

   expect( name(".abc").to_string() ).toBe( ".abc" )
   expect( name(".........abc").to_string() ).toBe( ".........abc" )
   expect( name("123.").to_string() ).toBe( "123" )
   expect( name("123.........").to_string() ).toBe( "123" )
   expect( name(".a.b.c.1.2.3.").to_string() ).toBe( ".a.b.c.1.2.3" )

   expect( name("abc.123").to_string() ).toBe( "abc.123" )
   expect( name("123.abc").to_string() ).toBe( "123.abc" )

   expect( name("12345abcdefgj").to_string() ).toBe( "12345abcdefgj" )
   expect( name("hijklmnopqrsj").to_string() ).toBe( "hijklmnopqrsj" )
   expect( name("tuvwxyz.1234j").to_string() ).toBe( "tuvwxyz.1234j" )

   expect( name("111111111111j").to_string() ).toBe( "111111111111j" )
   expect( name("555555555555j").to_string() ).toBe( "555555555555j" )
   expect( name("aaaaaaaaaaaaj").to_string() ).toBe( "aaaaaaaaaaaaj" )
   expect( name("zzzzzzzzzzzzj").to_string() ).toBe( "zzzzzzzzzzzzj" )

   // ----------------------------------------------------------
   // friend constexpr bool operator==(const name&, const name&)
   expect( name("1").isEqual( name("1") )).toBeTruthy();
   expect( name("5").isEqual( name("5") )).toBeTruthy();
   expect( name("a").isEqual( name("a") )).toBeTruthy();
   expect( name("z").isEqual( name("z") )).toBeTruthy();

   expect( name("abc").isEqual( name("abc") )).toBeTruthy();
   expect( name("123").isEqual( name("123") )).toBeTruthy();

   expect( name(".abc").isEqual( name(".abc") )).toBeTruthy();
   expect( name(".........abc").isEqual( name(".........abc") )).toBeTruthy();
   expect( name("123.").isEqual( name("123") )).toBeTruthy();
   expect( name("123.........").isEqual( name("123") )).toBeTruthy();
   expect( name(".a.b.c.1.2.3.").isEqual( name(".a.b.c.1.2.3") )).toBeTruthy();

   expect( name("abc.123").isEqual( name("abc.123") )).toBeTruthy();
   expect( name("123.abc").isEqual( name("123.abc") )).toBeTruthy();

   expect( name("12345abcdefgj").isEqual( name("12345abcdefgj") )).toBeTruthy();
   expect( name("hijklmnopqrsj").isEqual( name("hijklmnopqrsj") )).toBeTruthy();
   expect( name("tuvwxyz.1234j").isEqual( name("tuvwxyz.1234j") )).toBeTruthy();

   expect( name("111111111111j").isEqual( name("111111111111j") )).toBeTruthy();
   expect( name("555555555555j").isEqual( name("555555555555j") )).toBeTruthy();
   expect( name("aaaaaaaaaaaaj").isEqual( name("aaaaaaaaaaaaj") )).toBeTruthy();
   expect( name("zzzzzzzzzzzzj").isEqual( name("zzzzzzzzzzzzj") )).toBeTruthy();

   // -----------------------------------------------------------
   // friend constexpr bool operator!=(const name&, const name&)
   expect( name("1").isNotEqual( name() )).toBeTruthy();
   expect( name("5").isNotEqual( name() )).toBeTruthy();
   expect( name("a").isNotEqual( name() )).toBeTruthy();
   expect( name("z").isNotEqual( name() )).toBeTruthy();

   expect( name("abc").isNotEqual( name() )).toBeTruthy();
   expect( name("123").isNotEqual( name() )).toBeTruthy();

   expect( name(".abc").isNotEqual( name() )).toBeTruthy();
   expect( name(".........abc").isNotEqual( name() )).toBeTruthy();
   expect( name("123.").isNotEqual( name() )).toBeTruthy();
   expect( name("123.........").isNotEqual( name() )).toBeTruthy();
   expect( name(".a.b.c.1.2.3.").isNotEqual( name() )).toBeTruthy();

   expect( name("abc.123").isNotEqual( name() )).toBeTruthy();
   expect( name("123.abc").isNotEqual( name() )).toBeTruthy();

   expect( name("12345abcdefgj").isNotEqual( name() )).toBeTruthy();
   expect( name("hijklmnopqrsj").isNotEqual( name() )).toBeTruthy();
   expect( name("tuvwxyz.1234j").isNotEqual( name() )).toBeTruthy();

   expect( name("111111111111j").isNotEqual( name() )).toBeTruthy();
   expect( name("555555555555j").isNotEqual( name() )).toBeTruthy();
   expect( name("aaaaaaaaaaaaj").isNotEqual( name() )).toBeTruthy();
   expect( name("zzzzzzzzzzzzj").isNotEqual( name() )).toBeTruthy();

   // ---------------------------------------------------------
   // friend constexpr bool operator<(const name&, const name&)
   expect( name().isLessThan( name("1") )).toBeTruthy();
   expect( name().isLessThan( name("5") )).toBeTruthy();
   expect( name().isLessThan( name("a") )).toBeTruthy();
   expect( name().isLessThan( name("z") )).toBeTruthy();

   expect( name().isLessThan( name("abc") )).toBeTruthy();
   expect( name().isLessThan( name("123") )).toBeTruthy();

   expect( name().isLessThan( name(".abc") )).toBeTruthy();
   expect( name().isLessThan( name(".........abc") )).toBeTruthy();
   expect( name().isLessThan( name("123.") )).toBeTruthy();
   expect( name().isLessThan( name("123.........") )).toBeTruthy();
   expect( name().isLessThan( name(".a.b.c.1.2.3.") )).toBeTruthy();

   expect( name().isLessThan( name("abc.123") )).toBeTruthy();
   expect( name().isLessThan( name("123.abc") )).toBeTruthy();

   expect( name().isLessThan( name("12345abcdefgj") )).toBeTruthy();
   expect( name().isLessThan( name("hijklmnopqrsj") )).toBeTruthy();
   expect( name().isLessThan( name("tuvwxyz.1234j") )).toBeTruthy();

   expect( name().isLessThan( name("111111111111j") )).toBeTruthy();
   expect( name().isLessThan( name("555555555555j") )).toBeTruthy();
   expect( name().isLessThan( name("aaaaaaaaaaaaj") )).toBeTruthy();
   expect( name().isLessThan( name("zzzzzzzzzzzzj") )).toBeTruthy();
});