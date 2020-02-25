import { symbol } from "..";

test("symbol", async () => {
  const A = symbol("A", 4);

  // equal
  expect(A == A).toBeTruthy();
});
