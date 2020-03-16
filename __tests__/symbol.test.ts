import { symbol, symbol_code } from "..";

// const u64min = 0n;
const u64max = 18446744073709551615n;

test("symbol", () => {
  const sc0 = symbol_code("A");
  const sc1 = symbol_code("Z");
  const sc2 = symbol_code("AAAAAAA");
  const sc3 = symbol_code("ZZZZZZZ");

  //// constexpr symbol()
  // constexpr uint64_t raw()const
  expect( symbol().raw() ).toBe( 0n )

  //// constexpr explicit symbol(uint64_t)
  expect( symbol( 0n ).raw()).toBe( 0n )
  expect( symbol( 1n ).raw()).toBe( 1n )
  expect( symbol( u64max ).raw()).toBe( u64max )

  //// constexpr symbol(string_view, uint8_t)
  // Note:
  // Unless constructed with `initializer_list`, precision does not check for wrap-around
  expect( symbol( sc0, 0 ).raw()).toBe( 16640n )
  expect( symbol( sc1, 0 ).raw()).toBe( 23040n )
  expect( symbol( sc2, 0 ).raw()).toBe( 4702111234474983680n )
  expect( symbol( sc3, 0 ).raw()).toBe( 6510615555426900480n )

  //// constexpr symbol(symbol_code, uint8_t)
  expect( symbol( sc0, 0 ).raw()).toBe( 16640n )
  expect( symbol( sc1, 0 ).raw()).toBe( 23040n )
  expect( symbol( sc2, 0 ).raw()).toBe( 4702111234474983680n )
  expect( symbol( sc3, 0 ).raw()).toBe( 6510615555426900480n )

  // --------------------
  // bool is_valid()const
  expect( symbol( 16640n ).is_valid()).toBeTruthy() // "A", precision: 0
  expect( symbol( 23040n ).is_valid()).toBeTruthy() // "Z", precision: 0
  expect( symbol( 4702111234474983680n ).is_valid()).toBeTruthy() // "AAAAAAA", precision: 0
  expect( symbol( 6510615555426900480n ).is_valid()).toBeTruthy() // "ZZZZZZZ", precision: 0

  expect( symbol( 16639n ).is_valid()).toBeFalsy();
  expect( symbol( 6510615555426900736n ).is_valid()).toBeFalsy();

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

  // // -----------------------
  // // symbol_code code()const
  // CHECK_EQUAL( (symbol{sc0,0}.code()), sc0 )
  // CHECK_EQUAL( (symbol{sc1,0}.code()), sc1 )
  // CHECK_EQUAL( (symbol{sc2,0}.code()), sc2 )
  // CHECK_EQUAL( (symbol{sc3,0}.code()), sc3 )

  // // ---------------------------------------
  // // constexpr explicit operator bool()const
  // CHECK_EQUAL( symbol{0}.operator bool()).toBeFalsy();
  // CHECK_EQUAL( symbol{1}.operator bool()).toBeTruthy()
  // CHECK_EQUAL( !symbol{0}.operator bool()).toBeTruthy()
  // CHECK_EQUAL( !symbol{1}.operator bool()).toBeFalsy();

  // CHECK_EQUAL( (symbol{"", 0}.operator bool())).toBeFalsy();
  // CHECK_EQUAL( (symbol{"SYMBOLL", 0}.operator bool())).toBeTruthy()
  // CHECK_EQUAL( (!symbol{"", 0}.operator bool())).toBeTruthy()
  // CHECK_EQUAL( (!symbol{"SYMBOLL", 0}.operator bool())).toBeFalsy();

  // // ---------------------
  // // void print(bool)const
  // CHECK_PRINT( "0,A", [&](){symbol{"A", 0}.print(true);} );
  // CHECK_PRINT( "0,Z", [&](){symbol{"Z", 0}.print(true);} );
  // CHECK_PRINT( "255,AAAAAAA", [&](){symbol{"AAAAAAA", 255}.print(true);} );
  // CHECK_PRINT( "255,ZZZZZZZ", [&](){symbol{"ZZZZZZZ", 255}.print(true);} );

  // // --------------------------------------------------------------
  // // friend constexpr bool operator==(const symbol&, const symbol&)
  // CHECK_EQUAL( (symbol{sc0, 0} == symbol{sc0, 0})).toBeTruthy()
  // CHECK_EQUAL( (symbol{sc1, 0} == symbol{sc1, 0})).toBeTruthy()
  // CHECK_EQUAL( (symbol{sc2, 0} == symbol{sc2, 0})).toBeTruthy()
  // CHECK_EQUAL( (symbol{sc3, 0} == symbol{sc3, 0})).toBeTruthy()

  // // --------------------------------------------------------------
  // // friend constexpr bool operator!=(const symbol&, const symbol&)
  // CHECK_EQUAL( (symbol{sc0, 0} != symbol{})).toBeTruthy()
  // CHECK_EQUAL( (symbol{sc1, 0} != symbol{})).toBeTruthy()
  // CHECK_EQUAL( (symbol{sc2, 0} != symbol{})).toBeTruthy()
  // CHECK_EQUAL( (symbol{sc3, 0} != symbol{})).toBeTruthy()

  // // --------------------------------------------------------------
  // // friend constexpr bool operator<(const symbol&, const symbol&)
  // CHECK_EQUAL( (symbol{} < symbol{sc0, 0})).toBeTruthy()
  // CHECK_EQUAL( (symbol{} < symbol{sc1, 0})).toBeTruthy()
  // CHECK_EQUAL( (symbol{} < symbol{sc2, 0})).toBeTruthy()
  // CHECK_EQUAL( (symbol{} < symbol{sc3, 0})).toBeTruthy()
});
