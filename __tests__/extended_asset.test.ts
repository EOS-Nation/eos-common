import { name, extended_symbol, extended_asset, asset, symbol } from "..";

const asset_mask: bigint = (BigInt(1) << BigInt(62)) - BigInt(1);
const asset_min: bigint = -asset_mask; // -4611686018427387903
const asset_max: bigint = asset_mask; //  4611686018427387903


test("extended_asset_type_test", () => {
    const sym_no_prec = symbol("SYMBOLL", 0);
    const sym_prec = symbol("SYMBOLL", 63);

    const ext_sym_no_prec = extended_symbol( sym_no_prec, name("eosioaccountj"));
    const ext_sym_prec = extended_symbol( sym_prec, name("eosioaccountj"));

    const asset_no_prec = asset(0, sym_no_prec );
    const asset_prec = asset(0, sym_prec );

    //// extended_asset()
    expect( extended_asset().quantity ).toStrictEqual( asset() )
    expect( extended_asset().contract ).toStrictEqual( name() )

    //// extended_asset(int64_t, extended_symbol)
    expect( extended_asset( {ext_sym: ext_sym_no_prec} ).quantity).toStrictEqual( asset(0, sym_no_prec))
    expect( extended_asset( {ext_sym: ext_sym_no_prec} ).contract).toStrictEqual( name("eosioaccountj"))

    //// extended_asset(asset, name)
    expect( extended_asset( { quantity: asset_no_prec, contract: name("eosioaccountj") }).quantity).toStrictEqual( asset( 0n, sym_no_prec ))
    expect( extended_asset( { quantity: asset_no_prec, contract: name("eosioaccountj") }).contract).toStrictEqual( name("eosioaccountj"))

    // ------------------------------------------
    // extended_symbol get_extended_symbol()const
    expect( extended_asset({ ext_sym: ext_sym_no_prec }).get_extended_symbol()).toStrictEqual( ext_sym_no_prec )
    expect( extended_asset({ ext_sym: ext_sym_prec }).get_extended_symbol()).toStrictEqual( ext_sym_prec )


    // -------------------------------
    // extended_asset operator-()const
    expect( extended_asset( { quantity: asset(  0, sym_no_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset_no_prec }).quantity)
    expect( extended_asset( { quantity: asset( -0, sym_no_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset_no_prec }).quantity)
    expect( extended_asset( { quantity: asset(  0, sym_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset_prec }).quantity)
    expect( extended_asset( { quantity: asset( -0, sym_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset_prec }).quantity)

    expect( extended_asset( { quantity: asset( 1, sym_no_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset( -1, sym_no_prec ) } ).quantity)
    expect( extended_asset( { quantity: asset( 1, sym_no_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset( -1, sym_no_prec ) } ).quantity)
    expect( extended_asset( { quantity: asset( 1, sym_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset( -1, sym_prec ) } ).quantity)
    expect( extended_asset( { quantity: asset( 1, sym_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset( -1, sym_prec ) } ).quantity)

    expect( extended_asset( { quantity: asset( asset_max, sym_no_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset( asset_min, sym_no_prec ) } ).quantity)
    expect( extended_asset( { quantity: asset( asset_max, sym_no_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset( asset_min, sym_no_prec ) } ).quantity)
    expect( extended_asset( { quantity: asset( asset_max, sym_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset( asset_min, sym_prec ) } ).quantity)
    expect( extended_asset( { quantity: asset( asset_max, sym_prec ) }).times( -1 ).quantity).toStrictEqual( extended_asset( { quantity: asset( asset_min, sym_prec ) } ).quantity)

    // -----------------------------------------------------------------------------
    // friend extended_asset operator+(const extended_asset&, const extended_asset&)
    expect( extended_asset( { quantity: asset( 0, sym_no_prec ) }).plus( extended_asset( { quantity: asset( 0, sym_no_prec )} ))).toStrictEqual( extended_asset( { quantity: asset_no_prec } ))
    expect( extended_asset( { quantity: asset( 1, sym_no_prec ) }).plus( extended_asset( { quantity: asset(-1, sym_no_prec )} ))).toStrictEqual( extended_asset( { quantity: asset_no_prec } ))

    expect( () => {
        extended_asset({ quantity: asset_no_prec, contract: name("eosioaccountj") }).plus( extended_asset( { quantity: asset_no_prec, contract: name("jtnuoccaoisoe")}))
    }).toThrow("type mismatch")

    // -------------------------------------------------------------------------
    // friend extended_asset& operator+=(extended_asset&, const extended_asset&)
    let temp = extended_asset({ quantity: asset_no_prec } );
    expect( temp.plus(temp) ).toStrictEqual( extended_asset( { quantity: asset_no_prec }))
    temp = extended_asset( { quantity: asset( 1, sym_no_prec) } )
    expect( temp.plus( extended_asset( { quantity: asset(-1, sym_no_prec )}))).toStrictEqual(extended_asset( {quantity: asset_no_prec }))

    expect( () => {
        temp.plus( extended_asset( { quantity: asset_no_prec, contract: name("eosioaccountj") }));
    }).toThrow("type mismatch")

    // -----------------------------------------------------------------------------
    // friend extended_asset operator-(const extended_asset&, const extended_asset&)
    expect( extended_asset( { quantity: asset( 0, sym_no_prec ) }).minus( extended_asset( { quantity: asset( 0, sym_no_prec )} ))).toStrictEqual( extended_asset( { quantity: asset_no_prec } ))
    expect( extended_asset( { quantity: asset( 1, sym_no_prec ) }).minus( extended_asset( { quantity: asset( 1, sym_no_prec )} ))).toStrictEqual( extended_asset( { quantity: asset_no_prec } ))

    expect( () => {
        extended_asset({ quantity: asset_no_prec, contract: name("eosioaccountj") }).minus( extended_asset( { quantity: asset_no_prec, contract: name("jtnuoccaoisoe")}))
    }).toThrow("type mismatch")

    // --------------------------------------------------------------------------
    // friend extended_asset& operator-=(extended_asset&, const extended_asset&)
    temp = extended_asset({ quantity: asset_no_prec } );
    expect( temp.minus(temp) ).toStrictEqual( extended_asset( { quantity: asset_no_prec }))
    temp = extended_asset( { quantity: asset( 1, sym_no_prec) } )
    expect( temp.minus( extended_asset( { quantity: asset( 1, sym_no_prec )}))).toStrictEqual(extended_asset( {quantity: asset_no_prec }))

    expect( () => {
        temp.minus( extended_asset( { quantity: asset_no_prec, contract: name("jtnuoccaoisoe") }));
    }).toThrow("type mismatch")

    // --------------------------------------------------------------------
    // friend bool operator==(const extended_asset&, const extended_asset&)
    expect( extended_asset( { quantity: asset_no_prec }).isEqual( extended_asset({ quantity: asset_no_prec }))).toBeTruthy();
    expect( extended_asset( { quantity: asset(1, sym_no_prec) }).isEqual( extended_asset( {quantity: asset(1, sym_no_prec )}))).toBeTruthy()

    // --------------------------------------------------------------------
    // friend bool operator!=(const extended_asset&, const extended_asset&)
    expect( extended_asset( { quantity: asset_no_prec, contract: name("eosioaccountj")}).isNotEqual( extended_asset( { quantity: asset_no_prec, contract: name("jtnuoccaoisoe")}))).toBeTruthy()
    expect( extended_asset( { quantity: asset(1, sym_no_prec) }).isNotEqual( extended_asset( { quantity: asset( -1, sym_no_prec ) }))).toBeTruthy()
    expect( extended_asset( { quantity: asset(1, sym_no_prec) }).isNotEqual( extended_asset( { quantity: asset( 0, sym_no_prec ), contract: name("eosioaccountj") }))).toBeTruthy();

    // -------------------------------------------------------------------
    // friend bool operator<(const extended_asset&, const extended_asset&)
    expect( extended_asset( {quantity: asset_no_prec, contract: name()}).isLessThan( extended_asset( {quantity: asset( 1, sym_no_prec ) }))).toBeTruthy();
    expect( () => {
        extended_asset({ contract: name() }).isLessThan( extended_asset({ contract: name("eosioaccountj") }));
    }).toThrow("type mismatch")

    // --------------------------------------------------------------------
    // friend bool operator<=(const extended_asset&, const extended_asset&)
    expect( extended_asset( { quantity: asset_no_prec, contract: name() }).isLessThanOrEqual( extended_asset( { quantity: asset( 1, sym_no_prec) } ))).toBeTruthy();
    expect( () => {
        extended_asset({ contract: name() }).isLessThanOrEqual( extended_asset({ contract: name("eosioaccountj") }));
    }).toThrow("type mismatch")

    // --------------------------------------------------------------------
    // friend bool operator>=(const extended_asset&, const extended_asset&)
    expect( extended_asset( { quantity: asset( 1, sym_no_prec ), contract: name() }).isGreaterThanOrEqual( extended_asset( { quantity: asset_no_prec, contract: name() } ))).toBeTruthy();
    expect( () => {
        extended_asset({ contract: name() }).isGreaterThanOrEqual( extended_asset({ contract: name("eosioaccountj") }));
    }).toThrow("type mismatch")
});