import { symbol } from "..";

test("symbol", () => {
  const A = symbol("A", 4);

  // equal
  expect(A == A).toBeTruthy();
});
