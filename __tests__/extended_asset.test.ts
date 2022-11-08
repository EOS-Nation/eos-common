import { name, extended_symbol, extended_asset, asset, symbol, ExtendedAsset } from "..";
import bigInt from "big-integer";

const asset_mask = (bigInt(1).shiftLeft(62)).minus(1);
const asset_min = asset_mask.multiply(-1); // -4611686018427387903
const asset_max = asset_mask; //  4611686018427387903

test("asset::prevent mutation side effects", () => {
    const amount = bigInt(10000);
    const extQuantity = ExtendedAsset.from({contract: "eosio.token", quantity: "1.0000 EOS"});
    expect( extQuantity.quantity.amount ).toStrictEqual(amount);
    ExtendedAsset.times(extQuantity, 2);
    expect( extQuantity.quantity.amount ).toStrictEqual(amount);
    ExtendedAsset.div(extQuantity, 4);
    expect( extQuantity.quantity.amount ).toStrictEqual(amount);
    ExtendedAsset.plus(extQuantity, 500);
    expect( extQuantity.quantity.amount ).toStrictEqual(amount);
    ExtendedAsset.minus(extQuantity, 4000);
    expect( extQuantity.quantity.amount ).toStrictEqual(amount);
});

test("extended_symbol::error: type mismatch", () => {
    const error = "type mismatch";
    const a = ExtendedAsset.from({contract: "eosio.token", quantity: "1.0000 EOS"});
    const b = ExtendedAsset.from({contract: "foo.bar", quantity: "1.0000 EOS"});

    expect( () => ExtendedAsset.times(a, b) ).toThrow(error);
    expect( () => ExtendedAsset.times(b, a) ).toThrow(error);
    expect( () => a.times(b) ).toThrow(error);
    expect( () => b.times(a) ).toThrow(error);

    expect( () => ExtendedAsset.div(a, b) ).toThrow(error);
    expect( () => ExtendedAsset.div(b, a) ).toThrow(error);
    expect( () => a.div(b) ).toThrow(error);
    expect( () => b.div(a) ).toThrow(error);
});


test("extended_symbol::error: comparison of assets with different symbols is not allowed", () => {
    const error = "comparison of assets with different symbols is not allowed";
    const a = ExtendedAsset.from({contract: "eosio.token", quantity: "1.0000 EOS"});
    const c = ExtendedAsset.from({contract: "eosio.token", quantity: "1.0000 FOO"});

    expect( () => ExtendedAsset.times(a, c) ).toThrow(error);
    expect( () => ExtendedAsset.times(c, a) ).toThrow(error);
    expect( () => a.times(c) ).toThrow(error);
    expect( () => c.times(a) ).toThrow(error);

    expect( () => ExtendedAsset.div(a, c) ).toThrow(error);
    expect( () => ExtendedAsset.div(c, a) ).toThrow(error);
    expect( () => a.div(c) ).toThrow(error);
    expect( () => c.div(a) ).toThrow(error);
});

test("extended_symbol::from", () => {
    const ext_sym = ExtendedAsset.from({contract: "eosio.token", quantity: "1.0000 EOS"});
    expect( Number(ext_sym.quantity.amount) ).toBe(10000);
    expect( Number(ext_sym.quantity.symbol.precision()) ).toBe(4);
    expect( ext_sym.quantity.symbol.code().toString() ).toBe("EOS");
    expect( ext_sym.contract.toString() ).toBe("eosio.token");
});

test("extended_asset::json", () => {
    const ext_asset = extended_asset({contract: "eosio.token", quantity: "1.0000 EOS"});
    const { contract, quantity } = ext_asset.toJSON();

    expect( contract ).toStrictEqual("eosio.token");
    expect( quantity ).toStrictEqual("1.0000 EOS");
});

test("extended_asset", () => {
    const contract = name("eosio.token");
    const sym_no_prec = symbol("SYMBOLL", 0);
    const sym_prec = symbol("SYMBOLL", 63);

    const ext_sym_no_prec = extended_symbol( sym_no_prec, contract);
    const ext_sym_prec = extended_symbol( sym_prec, contract);

    const asset_no_prec = asset(0, sym_no_prec );
    const asset_prec = asset(0, sym_prec );

    //// extended_asset()
    expect( extended_asset().quantity ).toStrictEqual( asset() )
    expect( extended_asset().contract ).toStrictEqual( name() )

    //// extended_asset(int64_t, extended_symbol)
    expect( extended_asset( 0, ext_sym_no_prec ).quantity).toStrictEqual( asset(0, sym_no_prec))
    expect( extended_asset( 0, ext_sym_no_prec ).contract).toStrictEqual( contract)

    //// extended_asset(asset, name)
    expect( extended_asset( asset_no_prec, contract ).quantity).toStrictEqual( asset( 0, sym_no_prec ))
    expect( extended_asset( asset_no_prec, contract ).contract).toStrictEqual( contract)

    // ------------------------------------------
    // extended_symbol get_extended_symbol()const
    expect( extended_asset( ext_sym_no_prec ).get_extended_symbol()).toStrictEqual( ext_sym_no_prec )
    expect( extended_asset( ext_sym_prec ).get_extended_symbol()).toStrictEqual( ext_sym_prec )


    // -------------------------------
    // extended_asset operator-()const
    expect( extended_asset( asset(  0, sym_no_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset_no_prec ).quantity)
    expect( extended_asset( asset( -0, sym_no_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset_no_prec ).quantity)
    expect( extended_asset( asset(  0, sym_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset_prec ).quantity)
    expect( extended_asset( asset( -0, sym_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset_prec ).quantity)

    expect( extended_asset( asset( 1, sym_no_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset( -1, sym_no_prec ) ).quantity)
    expect( extended_asset( asset( 1, sym_no_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset( -1, sym_no_prec ) ).quantity)
    expect( extended_asset( asset( 1, sym_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset( -1, sym_prec ) ).quantity)
    expect( extended_asset( asset( 1, sym_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset( -1, sym_prec ) ).quantity)

    expect( extended_asset( asset( asset_max, sym_no_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset( asset_min, sym_no_prec ) ).quantity)
    expect( extended_asset( asset( asset_max, sym_no_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset( asset_min, sym_no_prec ) ).quantity)
    expect( extended_asset( asset( asset_max, sym_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset( asset_min, sym_prec ) ).quantity)
    expect( extended_asset( asset( asset_max, sym_prec ) ).times( -1 ).quantity).toStrictEqual( extended_asset( asset( asset_min, sym_prec ) ).quantity)

    // -----------------------------------------------------------------------------
    // friend extended_asset operator+(const extended_asset&, const extended_asset&)
    expect( extended_asset( asset( 0, sym_no_prec ) ).plus( extended_asset( asset( 0, sym_no_prec ) ))).toStrictEqual( extended_asset( asset_no_prec ))
    expect( extended_asset( asset( 1, sym_no_prec ) ).plus( extended_asset( asset(-1, sym_no_prec ) ))).toStrictEqual( extended_asset( asset_no_prec ))

    expect( () => {
        extended_asset(asset_no_prec, contract ).plus( extended_asset( asset_no_prec, name("jtnuoccaoisoe") ))
    }).toThrow("type mismatch")

    // -------------------------------------------------------------------------
    // friend extended_asset& operator+=(extended_asset&, const extended_asset&)
    let temp = extended_asset( asset_no_prec );
    expect( temp.plus(temp) ).toStrictEqual( extended_asset( asset_no_prec ))
    temp = extended_asset( asset( 1, sym_no_prec) )
    expect( temp.plus( extended_asset( asset(-1, sym_no_prec )))).toStrictEqual(extended_asset( asset_no_prec ))

    expect( () => {
        temp.plus( extended_asset( asset_no_prec, contract ));
    }).toThrow("type mismatch")

    // -----------------------------------------------------------------------------
    // friend extended_asset operator-(const extended_asset&, const extended_asset&)
    expect( extended_asset( asset( 0, sym_no_prec ) ).minus( extended_asset( asset( 0, sym_no_prec ) ))).toStrictEqual( extended_asset( asset_no_prec ))
    expect( extended_asset( asset( 1, sym_no_prec ) ).minus( extended_asset( asset( 1, sym_no_prec ) ))).toStrictEqual( extended_asset( asset_no_prec ))

    expect( () => {
        extended_asset( asset_no_prec, contract ).minus( extended_asset( asset_no_prec, name("jtnuoccaoisoe") ))
    }).toThrow("type mismatch")

    // --------------------------------------------------------------------------
    // friend extended_asset& operator-=(extended_asset&, const extended_asset&)
    temp = extended_asset( asset_no_prec );
    expect( temp.minus(temp) ).toStrictEqual( extended_asset( asset_no_prec ))
    temp = extended_asset( asset( 1, sym_no_prec) )
    expect( temp.minus( extended_asset( asset( 1, sym_no_prec ) ))).toStrictEqual(extended_asset( asset_no_prec ))

    expect( () => {
        temp.minus( extended_asset( asset_no_prec, name("jtnuoccaoisoe") ));
    }).toThrow("type mismatch")

    // --------------------------------------------------------------------
    // friend bool operator==(const extended_asset&, const extended_asset&)
    expect( extended_asset( asset_no_prec ).isEqual( extended_asset( asset_no_prec ))).toBeTruthy();
    expect( extended_asset( asset(1, sym_no_prec) ).isEqual( extended_asset( asset(1, sym_no_prec ) ))).toBeTruthy()

    // --------------------------------------------------------------------
    // friend bool operator!=(const extended_asset&, const extended_asset&)
    expect( extended_asset( asset_no_prec, contract).isNotEqual( extended_asset( asset_no_prec, name("jtnuoccaoisoe")))).toBeTruthy()
    expect( extended_asset( asset(1, sym_no_prec) ).isNotEqual( extended_asset( asset( -1, sym_no_prec ) ))).toBeTruthy()
    expect( extended_asset( asset(1, sym_no_prec) ).isNotEqual( extended_asset( asset( 0, sym_no_prec ), contract ))).toBeTruthy();

    // -------------------------------------------------------------------
    // friend bool operator<(const extended_asset&, const extended_asset&)
    expect( extended_asset( asset_no_prec, name()).isLessThan( extended_asset( asset( 1, sym_no_prec ) ))).toBeTruthy();
    expect( () => {
        extended_asset( name() ).isLessThan( extended_asset( contract ));
    }).toThrow("type mismatch")

    // --------------------------------------------------------------------
    // friend bool operator<=(const extended_asset&, const extended_asset&)
    expect( extended_asset( asset_no_prec, name() ).isLessThanOrEqual( extended_asset( asset( 1, sym_no_prec)  ))).toBeTruthy();
    expect( () => {
        extended_asset( name() ).isLessThanOrEqual( extended_asset( contract ));
    }).toThrow("type mismatch")

    // --------------------------------------------------------------------
    // friend bool operator>=(const extended_asset&, const extended_asset&)
    expect( extended_asset( asset( 1, sym_no_prec ), name() ).isGreaterThanOrEqual( extended_asset( asset_no_prec, name()  ))).toBeTruthy();
    expect( () => {
        extended_asset( name() ).isGreaterThanOrEqual( extended_asset( contract ));
    }).toThrow("type mismatch")
});