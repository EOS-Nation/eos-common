import { name, Name } from "../";

// const u64min = 0n;
const u64max = 18446744073709551615n;

test("name", () => {
   //// constexpr name()
   expect( name().value).toBe( 0n )

   //// constexpr explicit name(uint64_t)
   expect( name(0n).value).toBe( 0n )
   expect( name(1n).value).toBe( 1n )
   expect( name(u64max).value).toBe( u64max )

   //// constexpr explicit name(string_view)
   // Note:
   // These are the exact `uint64_t` value representations of the given string
   expect( name("1").value).toBe( 576460752303423488n )
   expect( name("5").value).toBe( 2882303761517117440n )
   expect( name("a").value).toBe( 3458764513820540928n )
   expect( name("z").value).toBe( 17870283321406128128n )


   expect( name("abc").value ).toBe( 3589368903014285312n )
   expect( name("123").value ).toBe( 614178399182651392n )

   expect( name(".abc").value ).toBe( 112167778219196416n )
   expect( name(".........abc").value ).toBe( 102016n )
   expect( name("123.").value ).toBe( 614178399182651392n )
   expect( name("123.........").value ).toBe( 614178399182651392n )
   expect( name(".a.b.c.1.2.3.").value ).toBe( 108209673814966320n )

   expect( name("abc.123").value ).toBe( 3589369488740450304n )
   expect( name("123.abc").value ).toBe( 614181822271586304n )

   expect( name("12345abcdefgj").value ).toBe( 614251623682315983n )
   expect( name("hijklmnopqrsj").value ).toBe( 7754926748989239183n )
   expect( name("tuvwxyz.1234j").value ).toBe( 14895601873741973071n )

   expect( name("111111111111j").value ).toBe( 595056260442243615n )
   expect( name("555555555555j").value ).toBe( 2975281302211218015n )
   expect( name("aaaaaaaaaaaaj").value ).toBe( 3570337562653461615n )
   expect( name("zzzzzzzzzzzzj").value ).toBe( u64max )

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
   expect( name("1").raw() ).toBe( 576460752303423488n )
   expect( name("5").raw() ).toBe( 2882303761517117440n )
   expect( name("a").raw() ).toBe( 3458764513820540928n )
   expect( name("z").raw() ).toBe( 17870283321406128128n )

   expect( name("abc").raw() ).toBe( 3589368903014285312n )
   expect( name("123").raw() ).toBe( 614178399182651392n )

   expect( name(".abc").raw() ).toBe( 112167778219196416n )
   expect( name(".........abc").raw() ).toBe( 102016n )
   expect( name("123.").raw() ).toBe( 614178399182651392n )
   expect( name("123.........").raw() ).toBe( 614178399182651392n )
   expect( name(".a.b.c.1.2.3.").raw() ).toBe( 108209673814966320n )

   expect( name("abc.123").raw() ).toBe( 3589369488740450304n )
   expect( name("123.abc").raw() ).toBe( 614181822271586304n )

   expect( name("12345abcdefgj").raw() ).toBe( 614251623682315983n )
   expect( name("hijklmnopqrsj").raw() ).toBe( 7754926748989239183n )
   expect( name("tuvwxyz.1234j").raw() ).toBe( 14895601873741973071n )

   expect( name("111111111111j").raw() ).toBe( 595056260442243615n )
   expect( name("555555555555j").raw() ).toBe( 2975281302211218015n )
   expect( name("aaaaaaaaaaaaj").raw() ).toBe( 3570337562653461615n )
   expect( name("zzzzzzzzzzzzj").raw() ).toBe( u64max )

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