import { symbol_code } from "..";

test("symbol_code", () => {
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

   expect( () => symbol_code("ABCDEFGH")).toThrow("string is too long to be a valid symbol_code");
   expect( () => symbol_code("a")).toThrow("only uppercase letters allowed in symbol_code string");
   expect( () => symbol_code("z")).toThrow("only uppercase letters allowed in symbol_code string");
   expect( () => symbol_code("@")).toThrow("only uppercase letters allowed in symbol_code string");
   expect( () => symbol_code("[")).toThrow("only uppercase letters allowed in symbol_code string");

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