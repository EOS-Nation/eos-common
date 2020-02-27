import { Symbol, Asset, asset_to_number } from "..";

const BTC = new Symbol("BTC", 8);
const EOS = new Symbol("EOS", 4);

test("asset", () => {
  expect(new Asset("1.0000 EOS").amount).toEqual(10000n);
});

test(`comparison works as expected`, () => {
  expect(BTC.isEqual(EOS)).toBe(false);

  const amount1 = new Asset(1000, EOS);
  const amount2 = new Asset(2000, EOS);

  expect(amount1.symbol.isEqual(amount2.symbol)).toBe(true);
});

test("decimal conversions work as expected", () => {
    const amount1 = new Asset(10000, EOS);
    expect(asset_to_number(amount1)).toBe(1.0000);

    const amount2 = new Asset('911.7285 EOS');
    expect(asset_to_number(amount2)).toBe(911.7285);

    const amount3 = new Asset(100000000, BTC);
    expect(asset_to_number(amount3)).toBe(1.00000000);
});
