import { Symbol } from "..";

test("compare symbols", async () => {
  const A = new Symbol("A", 0);
  const AB = new Symbol("AB", 1);
  const ABC = new Symbol("ABC", 2);
  const ABCD = new Symbol("ABCD", 3);
  const ABCDE = new Symbol("ABCDE", 4);
  const ABCDEF = new Symbol("ABCDEF", 4);
  const ABCDEFG = new Symbol("ABCDEFG", 4);

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

  // to_string
  expect(A.code().to_string()).toBe("A");
  expect(AB.code().to_string()).toBe("AB");
  expect(ABC.code().to_string()).toBe("ABC");
  expect(ABCD.code().to_string()).toBe("ABCD");
  expect(ABCDE.code().to_string()).toBe("ABCDE");
  expect(ABCDEF.code().to_string()).toBe("ABCDEF");
});
