import * as common from "../";

const BTC = new common.Symbol("BTC", 8);
const EOS = new common.Symbol("EOS", 4);

test("split creates an asset", async () => {
  const split = common.split("1.0000 EOS");
  expect(split.amount).toEqual(10000);
});

test(`comparison works as expected`, async () => {
  expect(BTC.isEqual(EOS)).toBe(false);

  const amount1 = new common.Asset(1000, EOS);
  const amount2 = new common.Asset(2000, EOS);

  expect(amount1.symbol.isEqual(amount2.symbol)).toBe(true);
});

test("decimal conversions work as expected", () => {
    const amount1 = new common.Asset(10000, EOS);
    expect(amount1.toNumber()).toBe(1.0000);

    const amount2 = common.split(`1.0000 EOS`);
    expect(amount2.toNumber()).toBe(1.0000);

    const amount3 = new common.Asset(100000000, BTC);
    expect(amount3.toNumber()).toBe(1.00000000);
});
