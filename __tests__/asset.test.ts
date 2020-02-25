import { Symbol, Asset, split } from "..";

const BTC = new Symbol("BTC", 8);
const EOS = new Symbol("EOS", 4);

test("split creates an asset", async () => {
  expect(split("1.0000 EOS").amount).toEqual(10000);
});
test(`comparison works as expected`, async () => {
  expect(BTC.isEqual(EOS)).toBe(false);

  const amount1 = new Asset(1000, EOS);
  const amount2 = new Asset(2000, EOS);

  expect(amount1.symbol.isEqual(amount2.symbol)).toBe(true);
});

test("decimal conversions work as expected", () => {
    const amount1 = new Asset(10000, EOS);
    expect(amount1.to_double()).toBe(1.0000);

    const amount2 = split(`1.0000 EOS`);
    expect(amount2.to_double()).toBe(1.0000);

    const amount3 = new Asset(100000000, BTC);
    expect(amount3.to_double()).toBe(1.00000000);
});
