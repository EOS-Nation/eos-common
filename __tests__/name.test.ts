import { name } from "..";

const u64min = 0n;
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
});