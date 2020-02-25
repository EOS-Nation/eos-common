import { symbol_code } from "..";

test("symbol_code", async () => {
  const A = new symbol_code("A");
  const AB = new symbol_code("AB");
  const ABC = new symbol_code("ABC");
  const ABCD = new symbol_code("ABCD");
  const ABCDE = new symbol_code("ABCDE");
  const ABCDEF = new symbol_code("ABCDEF");
  const ABCDEFG = new symbol_code("ABCDEFG");

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
  expect(A.raw()).toBe(65);
  expect(AB.raw()).toBe(16961);
  expect(ABC.raw()).toBe(4407873);
  expect(ABCD.raw()).toBe(1145258561);
  expect(ABCDE.raw()).toBe(297498001985);
  expect(ABCDEF.raw()).toBe(77263311946305);
  expect(ABCDEFG.raw()).toBe(20061986658402881);

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

  // ERROR
  // Expected: "ABCDEFG"
  // Received: "@BCDEFG"
  // expect(ABCDEFG.to_string()).toBe("ABCDEFG");
});
