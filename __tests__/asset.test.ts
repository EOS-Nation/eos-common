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
    const quantity1 = new Asset(10000, EOS);
    expect(asset_to_number(quantity1)).toBe(1.0000);
    expect(quantity1.amount).toBe(10000n);

    const quantity2 = new Asset('911.7285 EOS');
    expect(asset_to_number(quantity2)).toBe(911.7285);
    expect(quantity2.amount).toBe(9117285n);

    const quantity3 = new Asset(100000000, BTC);
    expect(asset_to_number(quantity3)).toBe(1.00000000);
    expect(quantity3.amount).toBe(100000000n);

    const quantity4 = new Asset("9643.4600 USD");
    expect(asset_to_number(quantity4)).toBe(9643.4600);
    expect(quantity4.amount).toBe(96434600n);
});
