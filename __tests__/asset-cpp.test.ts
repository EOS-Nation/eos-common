import { asset, symbol } from "..";

const asset_mask: bigint = (BigInt(1) << BigInt(62)) - BigInt(1);
const asset_min: bigint = -asset_mask; // -4611686018427387903
const asset_max: bigint = asset_mask; //  4611686018427387903

test("asset_type_test", () => {
    const s0 = symbol("A", 0);
    const s1 = symbol("Z", 0);
    const s2 = symbol("AAAAAAA", 0);
    const s3 = symbol("ZZZZZZZ", 0);
    const sym_no_prec = symbol("SYMBOLL", 0); // Symbol with no precision
    const sym_prec = symbol("SYMBOLL", 63);   // Symbol with precision

    //// constexpr asset()
    expect( asset().amount).toBe( 0n );
    expect( asset().symbol.raw()).toBe( 0n );

    //// constexpr asset(int64_t, symbol)
    expect( asset(0n, s0).amount).toBe( 0n );
    expect( asset(asset_min, s0).amount).toBe( asset_min );
    expect( asset(asset_max, s0).amount).toBe( asset_max );

    expect( asset(0n, s0).symbol.raw()).toBe( 16640n ) // "A", precision: 0
    expect( asset(0n, s1).symbol.raw()).toBe( 23040n ) // "Z", precision: 0
    expect( asset(0n, s2).symbol.raw()).toBe( 4702111234474983680n ) // "AAAAAAA", precision: 0
    expect( asset(0n, s3).symbol.raw()).toBe( 6510615555426900480n ) // "ZZZZZZZ", precision: 0

    // Note: there is an invariant established for `asset` that is not enforced for `symbol`
    // For example:
    // `symbol{};` // valid code
    // `asset{{}, symbol{}};` // throws "invalid symbol name"

    expect( () => asset(0n, symbol( 0n ))).toThrow("invalid symbol name");
    expect( () => asset(0n, symbol( 1n ))).toThrow("invalid symbol name");
    expect( () => asset(0n, symbol( 16639n ))).toThrow("invalid symbol name");
    expect( () => asset(0n, symbol( 6510615555426900736n ))).toThrow("invalid symbol name");

    expect( () => asset( asset_min - 1n, symbol() )).toThrow("magnitude of asset amount must be less than 2^62");
    expect( () => asset( asset_max + 1n, symbol() )).toThrow("magnitude of asset amount must be less than 2^62");

});