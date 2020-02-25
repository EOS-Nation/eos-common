import { symbol_code } from "..";

test("symbol_code", () => {
  const A = symbol_code("A");
  const AB = symbol_code("AB");
  const ABC = symbol_code("ABC");
  const ABCD = symbol_code("ABCD");
  const ABCDE = symbol_code("ABCDE");
  const ABCDEF = symbol_code("ABCDEF");
  const ABCDEFG = symbol_code("ABCDEFG");

  // equal
  expect(A == A).toBeTruthy();
  expect(AB == AB).toBeTruthy();
  expect(ABC == ABC).toBeTruthy();
  expect(ABCD == ABCD).toBeTruthy();
  expect(ABCDE == ABCDE).toBeTruthy();
  expect(ABCDEF == ABCDEF).toBeTruthy();
  expect(ABCDEFG == ABCDEFG).toBeTruthy();

  // no equal
  expect(A == AB).toBeFalsy();
  expect(AB == ABC).toBeFalsy();
  expect(ABC == ABCD).toBeFalsy();
  expect(ABCD == ABCDE).toBeFalsy();
  expect(ABCDE == ABCDEF).toBeFalsy();
  expect(ABCDEF == ABCDEFG).toBeFalsy();
  expect(ABCDEFG == A).toBeFalsy();

  // raw
  expect(A.raw()).toBe(65n);
  expect(AB.raw()).toBe(16961n);
  expect(ABC.raw()).toBe(4407873n);
  expect(ABCD.raw()).toBe(1145258561n);
  expect(ABCDE.raw()).toBe(297498001985n);
  expect(ABCDEF.raw()).toBe(77263311946305n);
  expect(ABCDEFG.raw()).toBe(20061986658402881n);

  // length
  expect(A.length()).toBe(1);
  expect(AB.length()).toBe(2);
  expect(ABC.length()).toBe(3);
  expect(ABCD.length()).toBe(4);
  expect(ABCDE.length()).toBe(5);
  expect(ABCDEF.length()).toBe(6);
  expect(ABCDEFG.length()).toBe(7);

  // to_string
  expect(A.to_string()).toBe("A");
  expect(AB.to_string()).toBe("AB");
  expect(ABC.to_string()).toBe("ABC");
  expect(ABCD.to_string()).toBe("ABCD");
  expect(ABCDE.to_string()).toBe("ABCDE");
  expect(ABCDEF.to_string()).toBe("ABCDEF");
  expect(ABCDEFG.to_string()).toBe("ABCDEFG");
});

// Definitions in `eosio.cdt/libraries/eosio/symbol.hpp`
test("symbol_code_type_test", () => {
   //// constexpr symbol_code()
   // constexpr uint64_t raw()const
   expect( symbol_code().raw()).toBe( 0n );

   //// constexpr explicit symbol_code(uint64_t raw)
   expect( symbol_code(0).raw()).toBe(0n);
   expect( symbol_code(1).raw()).toBe(1n);
   expect( symbol_code(BigInt(Number.MAX_SAFE_INTEGER)).raw()).toBe(BigInt(Number.MAX_SAFE_INTEGER) )

   //// constexpr explicit symbol_code(string_view str)
   expect( symbol_code("A").raw()).toBe( 65n )
   expect( symbol_code("Z").raw()).toBe( 90n )
   expect( symbol_code("AAAAAAA").raw()).toBe( 18367622009667905n )
   expect( symbol_code("ZZZZZZZ").raw()).toBe( 25432092013386330n )

  //  CHECK_ASSERT( "string is too long to be a valid symbol_code", ([]() {symbol_code{"ABCDEFGH"};}) )
  //  CHECK_ASSERT( "only uppercase letters allowed in symbol_code string", ([]() {symbol_code{"a"};}) )
  //  CHECK_ASSERT( "only uppercase letters allowed in symbol_code string", ([]() {symbol_code{"z"};}) )
  //  CHECK_ASSERT( "only uppercase letters allowed in symbol_code string", ([]() {symbol_code{"@"};}) )
  //  CHECK_ASSERT( "only uppercase letters allowed in symbol_code string", ([]() {symbol_code{"["};}) )

   // ------------------------------
   // constexpr bool is_valid()const
   expect( symbol_code(65).is_valid()).toBeTruthy() // "A"
   expect( symbol_code(90).is_valid()).toBeTruthy() // "Z"
   expect( symbol_code(18367622009667905n).is_valid()).toBeTruthy() // "AAAAAAA"
   expect( symbol_code(25432092013386330n).is_valid()).toBeTruthy() // "ZZZZZZZ"

   expect( symbol_code(64).is_valid()).toBeFalsy()
   expect( symbol_code(25432092013386331).is_valid()).toBeFalsy()

   // --------------------------------
   // constexpr uint32_t length()const
   expect( symbol_code("").length()).toBe( 0 )
   expect( symbol_code("S").length()).toBe( 1 )
   expect( symbol_code("SY").length()).toBe( 2 )
   expect( symbol_code("SYM").length()).toBe( 3 )
   expect( symbol_code("SYMB").length()).toBe( 4 )
   expect( symbol_code("SYMBO").length()).toBe( 5 )
   expect( symbol_code("SYMBOL").length()).toBe( 6 )
   expect( symbol_code("SYMBOLL").length()).toBe( 7 )

   // ---------------------------------------
   // constexpr explicit operator bool()const
   expect( symbol_code(0).isTruthy()).toBeFalsy()
   expect( symbol_code(1).isTruthy()).toBeTruthy()
   expect( !symbol_code(0).isTruthy()).toBeTruthy()
   expect( !symbol_code(1).isTruthy()).toBeFalsy()

   expect( symbol_code("").isTruthy()).toBeFalsy()
   expect( symbol_code("SYMBOL").isTruthy()).toBeTruthy()
   expect( !symbol_code("").isTruthy()).toBeTruthy()
   expect( !symbol_code("SYMBOL").isTruthy()).toBeFalsy()

   // -----------------------
   // string to_string()const
   expect( symbol_code("A").to_string()).toBe( "A" )
   expect( symbol_code("Z").to_string()).toBe( "Z" )
   expect( symbol_code("AAAAAAA").to_string()).toBe( "AAAAAAA" )
   expect( symbol_code("ZZZZZZZ").to_string()).toBe( "ZZZZZZZ" )

   // --------------------------------------------------------------
   // friend bool operator==(const symbol_code&, const symbol_code&)
   expect( symbol_code("A").isEqual(symbol_code("A"))).toBeTruthy()
   expect( symbol_code("Z").isEqual(symbol_code("Z"))).toBeTruthy()
   expect( symbol_code("AAAAAAA").isEqual(symbol_code("AAAAAAA"))).toBeTruthy()
   expect( symbol_code("ZZZZZZZ").isEqual(symbol_code("ZZZZZZZ"))).toBeTruthy()

   // --------------------------------------------------------------
   // friend bool operator!=(const symbol_code&, const symbol_code&)
   expect( symbol_code("A").isNotEqual(symbol_code())).toBeTruthy();
   expect( symbol_code("Z").isNotEqual(symbol_code())).toBeTruthy();
   expect( symbol_code("AAAAAAA").isNotEqual(symbol_code())).toBeTruthy();
   expect( symbol_code("ZZZZZZZ").isNotEqual(symbol_code())).toBeTruthy();

   // -------------------------------------------------------------
   // friend bool operator<(const symbol_code&, const symbol_code&)
   expect( symbol_code().isLessThan(symbol_code("A"))).toBeTruthy();
   expect( symbol_code().isLessThan(symbol_code("Z"))).toBeTruthy();
   expect( symbol_code().isLessThan(symbol_code("AAAAAAA"))).toBeTruthy();
   expect( symbol_code().isLessThan(symbol_code("ZZZZZZZ"))).toBeTruthy();
});