import { Symbol } from "..";

test("compare symbols", async () => {
  const BTC = new Symbol("BTC", 8);
  const EOS = new Symbol("EOS", 4);

  expect(EOS === EOS).toBeTruthy();
  expect(EOS !== BTC).toBeTruthy();
  expect(EOS.code()).toBe("EOS");
});
