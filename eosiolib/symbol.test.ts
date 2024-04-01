import { symbol, symbol_code, Sym } from "../dist";
import bigInt from "big-integer";

// const u64min = 0n;
const u64max = bigInt("18446744073709551615");

test("symbol::from", () => {
  const sym = Sym.from("4,EOS");
  expect( Number(sym.precision()) ).toBe(4);
  expect( sym.code().toString() ).toBe("EOS");
});

test("symbol::extra", () => {
  symbol(symbol("4,EOS"));
  expect(true).toBeTruthy();
});


test("symbol", () => {
  const sc0 = symbol_code("A");
  const sc1 = symbol_code("Z");
  const sc2 = symbol_code("AAAAAAA");
  const sc3 = symbol_code("ZZZZZZZ");

  //// constexpr symbol()
  // constexpr uint64_t raw()const
  expect( symbol().raw() ).toStrictEqual( bigInt(0) )

  //// constexpr explicit symbol(uint64_t)
  expect( symbol( 0 ).raw()).toStrictEqual( bigInt(0) )
  expect( symbol( 1 ).raw()).toStrictEqual( bigInt(1) )
  expect( symbol( u64max ).raw()).toStrictEqual( u64max )

  //// constexpr symbol(string_view, uint8_t)
  // Note:
  // Unless constructed with `initializer_list`, precision does not check for wrap-around
  expect( symbol( sc0, 0 ).raw()).toStrictEqual( bigInt(16640) )
  expect( symbol( sc1, 0 ).raw()).toStrictEqual( bigInt(23040) )
  expect( symbol( sc2, 0 ).raw()).toStrictEqual( bigInt("4702111234474983680") )
  expect( symbol( sc3, 0 ).raw()).toStrictEqual( bigInt("6510615555426900480") )

  //// constexpr symbol(symbol_code, uint8_t)
  expect( symbol( sc0, 0 ).raw()).toStrictEqual( bigInt("16640") )
  expect( symbol( sc1, 0 ).raw()).toStrictEqual( bigInt("23040") )
  expect( symbol( sc2, 0 ).raw()).toStrictEqual( bigInt("4702111234474983680") )
  expect( symbol( sc3, 0 ).raw()).toStrictEqual( bigInt("6510615555426900480") )

  // --------------------
  // bool is_valid()const
  expect( symbol( 16640 ).is_valid()).toBeTruthy() // "A", precision: 0
  expect( symbol( 23040 ).is_valid()).toBeTruthy() // "Z", precision: 0
  expect( symbol( bigInt("4702111234474983680") ).is_valid()).toBeTruthy() // "AAAAAAA", precision: 0
  expect( symbol( bigInt("6510615555426900480") ).is_valid()).toBeTruthy() // "ZZZZZZZ", precision: 0

  expect( symbol( 16639 ).is_valid()).toBeFalsy();
  expect( symbol( bigInt("6510615555426900736") ).is_valid()).toBeFalsy();

  // -------------------------
  // uint8_t precision()const
  expect( symbol( sc0, 0 ).precision()).toBe( 0 )
  expect( symbol( sc1, 0 ).precision()).toBe( 0 )
  expect( symbol( sc2, 0 ).precision()).toBe( 0 )
  expect( symbol( sc3, 0 ).precision()).toBe( 0 )

  expect( symbol( sc0, 255 ).precision()).toBe( 255 )
  expect( symbol( sc1, 255 ).precision()).toBe( 255 )
  expect( symbol( sc2, 255 ).precision()).toBe( 255 )
  expect( symbol( sc3, 255 ).precision()).toBe( 255 )

  // -----------------------
  // symbol_code code()const
  expect( symbol( sc0, 0 ).code().isEqual( sc0 )).toBeTruthy();
  expect( symbol( sc1, 0 ).code().isEqual( sc1 )).toBeTruthy();
  expect( symbol( sc2, 0 ).code().isEqual( sc2 )).toBeTruthy();
  expect( symbol( sc3, 0 ).code().isEqual( sc3 )).toBeTruthy();

  // ---------------------------------------
  // constexpr explicit operator bool()const
  expect( symbol( 0 ).bool()).toBeFalsy();
  expect( symbol( 1 ).bool()).toBeTruthy()
  expect( !symbol( 0 ).bool()).toBeTruthy()
  expect( !symbol( 1 ).bool()).toBeFalsy();

  expect( (symbol("", 0 ).bool())).toBeFalsy();
  expect( (symbol("SYMBOLL", 0 ).bool())).toBeTruthy()
  expect( (!symbol("", 0 ).bool())).toBeTruthy()
  expect( (!symbol("SYMBOLL", 0 ).bool())).toBeFalsy();

  // // ---------------------
  // // void print(bool)const
  // CHECK_PRINT( "0,A", [&](){symbol{"A", 0}.print(true);} );
  // CHECK_PRINT( "0,Z", [&](){symbol{"Z", 0}.print(true);} );
  // CHECK_PRINT( "255,AAAAAAA", [&](){symbol{"AAAAAAA", 255}.print(true);} );
  // CHECK_PRINT( "255,ZZZZZZZ", [&](){symbol{"ZZZZZZZ", 255}.print(true);} );

  // --------------------------------------------------------------
  // friend constexpr bool operator==(const symbol&, const symbol&)
  expect( symbol(sc0, 0).isEqual( symbol( sc0, 0))).toBeTruthy()
  expect( symbol(sc1, 0).isEqual( symbol( sc1, 0))).toBeTruthy()
  expect( symbol(sc2, 0).isEqual( symbol( sc2, 0))).toBeTruthy()
  expect( symbol(sc3, 0).isEqual( symbol( sc3, 0))).toBeTruthy()

  // --------------------------------------------------------------
  // friend constexpr bool operator!=(const symbol&, const symbol&)
  expect( symbol(sc0, 0).isNotEqual( symbol())).toBeTruthy()
  expect( symbol(sc1, 0).isNotEqual( symbol())).toBeTruthy()
  expect( symbol(sc2, 0).isNotEqual( symbol())).toBeTruthy()
  expect( symbol(sc3, 0).isNotEqual( symbol())).toBeTruthy()

  // --------------------------------------------------------------
  // friend constexpr bool operator<(const symbol&, const symbol&)
  expect( symbol().isLessThan( symbol( sc0, 0))).toBeTruthy()
  expect( symbol().isLessThan( symbol( sc1, 0))).toBeTruthy()
  expect( symbol().isLessThan( symbol( sc2, 0))).toBeTruthy()
  expect( symbol().isLessThan( symbol( sc3, 0))).toBeTruthy()
});
