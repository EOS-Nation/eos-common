import * as common from "../";

test("eos-common", async () => {
    const split = common.split("1.0000 EOS");
    expect(split.amount).toEqual(10000);
});
