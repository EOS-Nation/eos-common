import { symbol } from "..";

test("symbol", () => {
  const A = symbol("A", 4);
  const B = symbol("B,4");

  // equal
  expect(A.isEqual(A)).toBeTruthy();
});
