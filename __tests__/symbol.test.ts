import { symbol } from "..";

test("symbol", () => {
  const A = symbol("A", 4);
  const B = symbol("4,B");

  // equal
  expect(A.precision() ).toBe( 4 )
  expect(B.precision() ).toBe( 4 )
});
