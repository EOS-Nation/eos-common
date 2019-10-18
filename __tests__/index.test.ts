import * as common from "../";

test("eos-common", async () => {
    const split = common.split("1.0000 EOS");
    expect(split.amount).toEqual(10000);
});

test(`comparison works as expected`, async() => {
    const BTC = new common.Symbol('BTC', 8)
    const EOS = new common.Symbol('EOS', 4)

    expect(BTC.isEqual(EOS)).toBe(false);

    const amount1 = new common.Asset(1000, EOS);
    const amount2 = new common.Asset(2000, EOS);

    expect(amount1.symbol.isEqual(amount2.symbol)).toBe(true)

})
