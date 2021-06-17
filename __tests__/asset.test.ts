import { asset, symbol, Asset, asset_to_number } from "..";
import bigInt from "big-integer";

const asset_mask = (bigInt(1).shiftLeft(62)).minus(1);
const asset_min = asset_mask.multiply(-1); // -4611686018427387903
const asset_max = asset_mask; //  4611686018427387903

function repeat( str: string, count: number ): string {
    let result = "";
    for ( let i = 0; i < count; i++) {
        result += str;
    }
    return result;
}

test("asset::extra", () => {
    expect( Number(asset(1.123, symbol("4,EOS")).amount) ).toBe(1);
    expect( Number(asset("0.5730 EOS").amount) ).toBe(5730);
    asset(asset("1.0000 EOS"));
});

test("asset::divide", () => {
    const asset1 = new Asset('1.0000 EOS');
    const asset2 = new Asset('2.0000 EOS');

    const result = Asset.div(asset1, asset_to_number(asset2));
    expect(asset_to_number(result)).toBe(0.5);
});

test("asset::eosiolib", () => {
    const s0 = symbol("A", 0);
    const s1 = symbol("Z", 0);
    const s2 = symbol("AAAAAAA", 0);
    const s3 = symbol("ZZZZZZZ", 0);
    const sym_no_prec = symbol("SYMBOLL", 0); // Symbol with no precision
    const sym_prec = symbol("SYMBOLL", 63);   // Symbol with precision

    //// constexpr asset()
    expect( asset().amount).toStrictEqual( bigInt(0) );
    expect( asset().symbol.raw()).toStrictEqual( bigInt(0) );

    //// constexpr asset(int64_t, symbol)
    expect( asset( 0, s0).amount).toStrictEqual( bigInt(0) );
    expect( asset( asset_min, s0).amount).toStrictEqual( asset_min );
    expect( asset( asset_max, s0).amount).toStrictEqual( asset_max );

    expect( asset( 0, s0 ).symbol.raw()).toStrictEqual( bigInt("16640") ) // "A", precision: 0
    expect( asset( 0, s1 ).symbol.raw()).toStrictEqual( bigInt("23040") ) // "Z", precision: 0
    expect( asset( 0, s2 ).symbol.raw()).toStrictEqual( bigInt("4702111234474983680") ) // "AAAAAAA", precision: 0
    expect( asset( 0, s3 ).symbol.raw()).toStrictEqual( bigInt("6510615555426900480") ) // "ZZZZZZZ", precision: 0

    // Note: there is an invariant established for `asset` that is not enforced for `symbol`
    // For example:
    // `symbol{};` // valid code
    // `asset{{}, symbol{}};` // throws "invalid symbol name"

    expect( () => asset(0, symbol( 0 ))).toThrow("invalid symbol name");
    expect( () => asset(0, symbol( 1 ))).toThrow("invalid symbol name");
    expect( () => asset(0, symbol( 16639 ))).toThrow("invalid symbol name");
    expect( () => asset(0, symbol( bigInt("6510615555426900736") ))).toThrow("invalid symbol name");

    expect( () => asset( asset_min.minus(1), symbol() )).toThrow("magnitude of asset amount must be less than 2^62");
    expect( () => asset( asset_max.plus(1), symbol() )).toThrow("magnitude of asset amount must be less than 2^62");

    // ----------------------------------
    // bool is_amount_within_range()const
    const asset_check_amount = asset();
    asset_check_amount.amount = asset_min;
    expect( asset_check_amount.is_amount_within_range()).toBeTruthy();
    asset_check_amount.amount = asset_max;
    expect( asset_check_amount.is_amount_within_range()).toBeTruthy();

    asset_check_amount.amount = asset_min.minus(1);
    expect( asset_check_amount.is_amount_within_range()).toBeFalsy();
    asset_check_amount.amount = asset_max.plus(1);
    expect( asset_check_amount.is_amount_within_range()).toBeFalsy();

    // --------------------
    // bool is_valid()const
    const asset_valid = asset();
    asset_valid.symbol = symbol( 16640 ); // "A", precision: 0
    expect( asset_valid.is_valid() ).toBeTruthy();
    asset_valid.symbol = symbol( 23040 ); // "Z", precision: 0
    expect( asset_valid.is_valid() ).toBeTruthy();
    asset_valid.symbol = symbol( bigInt("4702111234474983680") );
    expect( asset_valid.is_valid() ).toBeTruthy(); // "AAAAAAA", precision: 0
    asset_valid.symbol = symbol( bigInt("6510615555426900480") );
    expect( asset_valid.is_valid() ).toBeTruthy(); // "ZZZZZZZ", precision: 0

    asset_valid.symbol = symbol( bigInt("16639") );
    expect( asset_valid.is_valid() ).toBeFalsy();
    asset_valid.symbol = symbol( bigInt("6510615555426900736") );
    expect( asset_valid.is_valid() ).toBeFalsy();

    // ------------------------
    // void set_amount(int64_t)
    const asset_set_amount = asset( 0, sym_no_prec );
    asset_set_amount.set_amount( 0 );
    expect( asset_set_amount.amount ).toStrictEqual( bigInt(0) );
    asset_set_amount.set_amount( 1 );
    expect( asset_set_amount.amount).toStrictEqual( bigInt(1) );
    asset_set_amount.set_amount( asset_min );
    expect( asset_set_amount.amount ).toStrictEqual( asset_min )
    asset_set_amount.set_amount( asset_max );
    expect( asset_set_amount.amount).toStrictEqual( asset_max );

    expect( () => asset_set_amount.set_amount( asset_min.minus(1) ) ).toThrow("magnitude of asset amount must be less than 2^62");
    expect( () => asset_set_amount.set_amount( asset_max.plus(1) ) ).toThrow("magnitude of asset amount must be less than 2^62");

    // ---------------------
    // std::to_string()const
    // Note:
    // Printing an `asset` is limited to a precision of 63
    // This will trigger an error:
    // `asset{int64_t{1LL}, symbol{"SYMBOLL", 64}}.print();` // output: "Floating point exception: ..."

    expect( asset( 0, sym_no_prec).to_string()).toBe( "0 SYMBOLL" )
    expect( asset(-0, sym_no_prec).to_string()).toBe( "0 SYMBOLL" )
    expect( asset( 0, sym_prec).to_string()).toBe( "0.000000000000000000000000000000000000000000000000000000000000000 SYMBOLL" )
    expect( asset(-0, sym_prec).to_string()).toBe( "0.000000000000000000000000000000000000000000000000000000000000000 SYMBOLL" )

    expect( asset(  1, sym_no_prec).to_string() ).toBe(  "1 SYMBOLL" )
    expect( asset( -1, sym_no_prec).to_string() ).toBe( "-1 SYMBOLL" )
    expect( asset( -1, symbol("SYMBOLL", 1) ).to_string()).toBe( "-0.1 SYMBOLL" );
    expect( asset(  1, symbol("SYMBOLL", 1) ).to_string()).toBe(  "0.1 SYMBOLL" );
    expect( asset( -12, sym_no_prec).to_string() ).toBe( "-12 SYMBOLL" )
    expect( asset(  12, sym_no_prec).to_string() ).toBe(  "12 SYMBOLL" )
    expect( asset( -123, sym_no_prec).to_string() ).toBe( "-123 SYMBOLL" )
    expect( asset(  123, sym_no_prec).to_string() ).toBe(  "123 SYMBOLL" )
    expect( asset( -12, symbol("SYMBOLL", 2) ).to_string()).toBe( "-0.12 SYMBOLL" );
    expect( asset(  12, symbol("SYMBOLL", 2) ).to_string()).toBe(  "0.12 SYMBOLL" );
    expect( asset( -12, symbol("SYMBOLL", 1) ).to_string()).toBe( "-1.2 SYMBOLL" );
    expect( asset(  12, symbol("SYMBOLL", 1) ).to_string()).toBe(  "1.2 SYMBOLL" );
    expect( asset( -123, symbol("SYMBOLL", 2) ).to_string()).toBe( "-1.23 SYMBOLL" );
    expect( asset(  123, symbol("SYMBOLL", 2) ).to_string()).toBe(  "1.23 SYMBOLL" );
    expect( asset(  1, sym_prec).to_string() ).toBe( "0.000000000000000000000000000000000000000000000000000000000000001 SYMBOLL" )
    expect( asset( -1, sym_prec).to_string() ).toBe( "-0.000000000000000000000000000000000000000000000000000000000000001 SYMBOLL" )

    expect( asset( asset_min, sym_no_prec).to_string() ).toBe( "-4611686018427387903 SYMBOLL" )
    expect( asset( asset_max, sym_no_prec).to_string() ).toBe(  "4611686018427387903 SYMBOLL" )
    expect( asset( asset_min, symbol("SYMBOLL", 2) ).to_string()).toBe( "-46116860184273879.03 SYMBOLL" );
    expect( asset( asset_max, symbol("SYMBOLL", 2) ).to_string()).toBe(  "46116860184273879.03 SYMBOLL" );
    expect( asset( asset_min, sym_prec).to_string() ).toBe( "-0.000000000000000000000000000000000000000000004611686018427387903 SYMBOLL" )
    expect( asset( asset_max, sym_prec).to_string() ).toBe( "0.000000000000000000000000000000000000000000004611686018427387903 SYMBOLL" )


    // Printing symbols at every level of precision, starting at a precision of `1`
    for( let precision = 1; precision < 64; ++precision ) {
        expect(asset(0, symbol("SYMBOLL", precision)).to_string()).toBe(`0.${ repeat("0", precision) } SYMBOLL`)
    }

    // ----------------------
    // asset operator-()const
    expect( asset( 0, sym_no_prec).times( -1 ).amount ).toStrictEqual( asset( 0, sym_no_prec).amount );
    expect( asset(-0, sym_no_prec).times( -1 ).amount ).toStrictEqual( asset( 0, sym_no_prec).amount );
    expect( asset( 0, sym_prec).times( -1 ).amount ).toStrictEqual( asset( 0, sym_prec).amount );
    expect( asset(-0, sym_prec).times( -1 ).amount ).toStrictEqual( asset( 0, sym_prec).amount );

    expect( asset( 1, sym_no_prec).times( -1 ).amount ).toStrictEqual( asset( -1, sym_no_prec ).amount );
    expect( asset(-1, sym_no_prec).times( -1 ).amount ).toStrictEqual( asset( 1, sym_no_prec ).amount );
    expect( asset( 1, sym_prec).times( -1 ).amount ).toStrictEqual( asset( -1, sym_prec ).amount );
    expect( asset(-1, sym_prec).times( -1 ).amount ).toStrictEqual( asset( 1, sym_prec ).amount );

    expect( asset( asset_min, sym_no_prec).times( -1 ).amount).toStrictEqual( asset( asset_max, sym_no_prec ).amount )
    expect( asset( asset_max, sym_no_prec).times( -1 ).amount).toStrictEqual( asset( asset_min, sym_no_prec ).amount )
    expect( asset( asset_min, sym_prec).times( -1 ).amount).toStrictEqual( asset( asset_max, sym_prec ).amount )
    expect( asset( asset_max, sym_prec).times( -1 ).amount).toStrictEqual( asset( asset_min, sym_prec ).amount )

    // ------------------------------------------------------------------------------------------
    // inline friend asset& operator+(const asset&, const asset&)/asset& operator+=(const asset&)
    expect( asset( 0, sym_no_prec ).plus( asset( 0, sym_no_prec) ) ).toStrictEqual( asset( 0, sym_no_prec ) );
    expect( asset( 1, sym_no_prec ).plus( asset( -1, sym_no_prec) ) ).toStrictEqual( asset( 0, sym_no_prec ) );

    expect( asset( "0.0000 A" ).plus( asset( "0.0000 A") ) ).toStrictEqual( asset( "0.0000 A" ) );
    expect( asset( "1.0000 A" ).plus( asset( "-1.0000 A") ) ).toStrictEqual( asset( "0.0000 A" ) );

    expect(() => {
        asset( 1, sym_no_prec ).plus( asset( 1, symbol( "LLOBMYS", 0 )) )
    }).toThrow("attempt to add asset with different symbol");

    expect(() => {
        asset( asset_min, sym_no_prec ).plus( asset( -1, sym_no_prec ) )
    }).toThrow("addition underflow");

    expect(() => {
        asset( asset_max, sym_no_prec ).plus( asset( 1, sym_no_prec ) )
    }).toThrow("addition overflow");

    // ------------------------------------------------------------------------------------------
    // inline friend asset& operator-(const asset&, const asset&)/asset& operator-=(const asset&)
    expect( asset( 0, sym_no_prec ).minus( 0 )).toStrictEqual( asset( 0, sym_no_prec ) )
    expect( asset( 1, sym_no_prec ).minus( 1 )).toStrictEqual( asset( 0, sym_no_prec ) )

    expect(() => {
        asset( 1, sym_no_prec ).minus( asset( 1, symbol("LLOBMYS", 0 )));
    }).toThrow("attempt to subtract asset with different symbol");

    expect(() => {
        asset( asset_min, sym_no_prec ).minus( asset( 1, sym_no_prec ));
    }).toThrow("subtraction underflow");

    expect(() => {
        asset( asset_max, sym_no_prec ).minus( asset( -1, sym_no_prec ));
    }).toThrow( "subtraction overflow");

    // -----------------------------------------------------------------------
    // friend asset operator*(const asset&, int64_t)/asset operator*=(int64_t)
    expect( asset( 0, sym_no_prec ).times( 0 ) ).toStrictEqual( asset( 0, sym_no_prec ) );
    expect( asset( 2, sym_no_prec ).times( 1 ) ).toStrictEqual( asset( 2, sym_no_prec ) );
    expect( asset( 2, sym_no_prec ).times( -1 ) ).toStrictEqual( asset( -2, sym_no_prec ) );

    expect(() => {
        asset( asset_min, sym_no_prec ).times( 2 );
    }).toThrow( "multiplication underflow");

    expect(() => {
        asset( asset_max, sym_no_prec ).times( 2 );
    }).toThrow( "multiplication overflow");

    expect(() => {
        asset( 1, sym_no_prec ).times( 0.5 );
    }).toThrow( "multiplicand must be integer");

    // ---------------------------------------------
    // friend asset operator/(const asset&, int64_t)
    expect( asset(  0, sym_no_prec ).div( 1 )).toStrictEqual( asset( 0, sym_no_prec) )
    expect( asset(  1, sym_no_prec ).div( 1 )).toStrictEqual( asset( 1, sym_no_prec) )
    expect( asset(  4, sym_no_prec ).div( 2 )).toStrictEqual( asset( 2, sym_no_prec) )
    expect( asset( -4, sym_no_prec ).div( 2 )).toStrictEqual( asset( -2, sym_no_prec) )
    expect( asset( -4, sym_no_prec ).div( -2 )).toStrictEqual( asset( 2, sym_no_prec) )

    // ----------------------------------------------------
    // friend int64_t operator/(const asset&, const asset&)
    expect( asset(  0, sym_no_prec ).div( asset( 1, sym_no_prec ) ).amount ).toStrictEqual( asset(  0, sym_no_prec ).amount )
    expect( asset(  1, sym_no_prec ).div( asset( 1, sym_no_prec ) ).amount ).toStrictEqual( asset(  1, sym_no_prec ).amount )
    expect( asset(  4, sym_no_prec ).div( asset( 2, sym_no_prec ) ).amount ).toStrictEqual( asset(  2, sym_no_prec ).amount )
    expect( asset( -4, sym_no_prec ).div( asset( 2, sym_no_prec ) ).amount ).toStrictEqual( asset( -2, sym_no_prec ).amount )
    expect( asset( -4, sym_no_prec ).div( asset( -2, sym_no_prec ) ).amount ).toStrictEqual( asset(  2, sym_no_prec ).amount )

    // ---------------------------------
    // friend asset& operator/=(int64_t)
    expect( asset(  0, sym_no_prec ).div( 1 )).toStrictEqual( asset(  0, sym_no_prec ))
    expect( asset(  1, sym_no_prec ).div( 1 )).toStrictEqual( asset(  1, sym_no_prec ))
    expect( asset(  4, sym_no_prec ).div( 2 )).toStrictEqual( asset(  2, sym_no_prec ))
    expect( asset( -4, sym_no_prec ).div( 2 )).toStrictEqual( asset( -2, sym_no_prec ))
    expect( asset( -4, sym_no_prec ).div( -2 )).toStrictEqual( asset(  2, sym_no_prec ))

    expect(() => {
        asset( 1, sym_no_prec ).div( 0 );
    }).toThrow( "divide by zero" );


    // Note:
    // There is no invariant established here when adding or setting the `amount`
    expect(() => {
        const a = asset();
        a.amount = asset_min;
        a.div( -1 );
    }).toThrow( "signed division overflow" );

    expect(() => {
        asset( 1, s0 ).div( asset( 1, s1 ) );
    }).toThrow( "comparison of assets with different symbols is not allowed" );

    expect(() => {
        asset( 1, sym_no_prec ).div( 1.5 );
    }).toThrow( "divisor must be integer" );

    // --------------------------------------------------
    // friend bool operator==(const asset&, const asset&)
    expect( asset( 0, sym_no_prec ).isEqual( asset( 0, sym_no_prec ) )).toBeTruthy()
    expect( asset( asset_min, sym_no_prec ).isEqual( asset( asset_min, sym_no_prec) )).toBeTruthy()
    expect( asset( asset_max, sym_no_prec ).isEqual( asset( asset_max, sym_no_prec) )).toBeTruthy()

    expect(() => {
        asset( 1, s0 ).isEqual( asset( 1, s1 ) );
    }).toThrow( "comparison of assets with different symbols is not allowed" );

    // ---------------------------------------------------
    // friend bool operator!=( const asset&, const asset&)
    expect( asset( asset_min, sym_no_prec ).isNotEqual( asset( asset_min.multiply(-1), sym_no_prec ) )).toBeTruthy();
    expect( asset( asset_max, sym_no_prec ).isNotEqual( asset( asset_max.multiply(-1), sym_no_prec ) )).toBeTruthy();

    // -------------------------------------------------
    // friend bool operator<(const asset&, const asset&)
    expect( asset( 0, sym_no_prec ).isLessThan( asset( 1, sym_no_prec ) )).toBeTruthy()

    // --------------------------------------------------
    // friend bool operator<=(const asset&, const asset&)
    expect( asset( 0, sym_no_prec ).isLessThanOrEqual( asset( 1, sym_no_prec ) )).toBeTruthy()
    expect( asset( 1, sym_no_prec ).isLessThanOrEqual( asset( 1, sym_no_prec ) )).toBeTruthy()

    // -------------------------------------------------
    // friend bool operator>(const asset&, const asset&)
    expect( asset( 1, sym_no_prec ).isGreaterThan( asset( 0, sym_no_prec ) )).toBeTruthy()
    expect( asset( 0, sym_no_prec ).isGreaterThan( asset( 1, sym_no_prec ) )).toBeFalsy()

    // --------------------------------------------------
    // friend bool operator>=( const asset&, const asset&)
    expect( asset( 1, sym_no_prec ).isGreaterThanOrEqual( asset( 0, sym_no_prec ) )).toBeTruthy()
    expect( asset( 1, sym_no_prec ).isGreaterThanOrEqual( asset( 1, sym_no_prec ) )).toBeTruthy()
});