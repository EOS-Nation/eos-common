import { Name } from "./name";
import { Asset } from "./asset";
// import { Sym } from "./symbol";
import { ExtendedSymbol } from "./extended_symbol";
import { check } from "./check";
import bigInt, { BigInteger } from "big-integer";

function getType( obj: any ): string {
    if ( typeof obj == "object" && obj.typeof ) return obj.typeof;
    return typeof obj;
}

function getAmount( obj: any ): BigInteger {
    if ( obj.typeof == "asset" ) return obj.amount;
    if ( obj.typeof == "extended_asset") return obj.quantity.amount;
    if ( bigInt.isInstance( obj )) return obj;
    if ( typeof obj == "number" ) return bigInt(obj);
    if ( typeof obj == "bigint" ) return bigInt(obj);
    if ( typeof obj == "string" ) return bigInt(obj);
    throw new Error("invalid amount");
}

// function getSymbol( obj: any ): Sym | null {
//     if ( obj.typeof == "extended_asset") return obj.quantity.symbol;
//     if ( obj.typeof == "extended_symbol") return obj.get_symbol();
//     if ( obj.typeof == "asset") return obj.symbol;
//     if ( obj.typeof == "symbol") return obj;
//     return null;
// }

function getContract( obj: any ): Name | null {
    if ( obj.typeof == "extended_asset") return obj.contract;
    if ( obj.typeof == "extended_symbol") return obj.get_contract();
    if ( obj.typeof == "name") return obj;
    return null;
}

/**
 * @class Stores the extended_asset
 * @brief Stores the extended_asset as a uint64_t value
 */
export class ExtendedAsset {
    get [Symbol.toStringTag](): string {
        return 'extended_asset';
    }
    public get typeof(): string { return 'extended_asset' }

    public static isInstance( obj: any ): boolean { return obj instanceof ExtendedAsset; }

    /**
     * The asset
     */
    public quantity = new Asset();

    /**
     * The owner of the asset
     */
    public contract = new Name();

    /**
     * Get the extended symbol of the asset
     *
     * @return extended_symbol - The extended symbol of the asset
     */
    public get_extended_symbol(): ExtendedSymbol { return new ExtendedSymbol( this.quantity.symbol, this.contract ); }

    /**
     * Extended asset which stores the information of the owner of the asset
     */
    constructor ( a: Asset, c: Name )
    constructor ( c: Name )
    constructor ( v: number | bigint | BigInteger, s: ExtendedSymbol )
    constructor ( s: ExtendedSymbol )
    constructor ( obj1?: any, obj2?: any ) {
        // Asset & Contract
        if ( getType(obj1) == "asset" ) this.quantity = obj1;
        if ( getType(obj2) == "name" ) this.contract = obj2;

        // Contract
        if ( getType(obj1) == "name" ) this.contract = obj1;

        // Value & Extended Symbol
        if ( getType(obj2) == "extended_symbol" ) {
            this.quantity = new Asset( bigInt( obj1 || 0 ), obj2.get_symbol() );
            this.contract = obj2.get_contract();
        }

        // Extended Symbol
        if ( getType(obj1) == "extended_symbol" ) {
            this.quantity = new Asset( 0, obj1.get_symbol() );
            this.contract = obj1.get_contract();
        }
    }

    // /**
    //  * %Print the extended asset
    //  */
    // public print(): void {
    //     this.quantity.print();
    //     process.stdout.write("@" + this.contract.to_string());
    // }

    /// @cond OPERATORS

    // Multiplication assignment operator
    public times(a: ExtendedAsset | number | bigint | BigInteger ): ExtendedAsset {
        const amount = getAmount( a );
        const contract = getContract( a );

        if ( contract ) check( contract.raw().equals( this.contract.raw() ), "type mismatch" );
        this.quantity.times( amount );
        return this;
    }

    public static times(a: ExtendedAsset, b: ExtendedAsset | number | bigint | BigInteger ): ExtendedAsset {
        const contract = getContract( a );

        if ( contract ) check( a.contract.raw().equals( contract.raw() ), "type mismatch" );
        const result = new ExtendedAsset( a.quantity, a.contract );
        result.times( b );
        return result;
    }

    // Division operator
    public div(a: ExtendedAsset | number | bigint | BigInteger ): ExtendedAsset {
        const amount = getAmount( a );
        const contract = getContract( a );

        if ( contract ) check( contract.raw().equals( this.contract.raw() ), "type mismatch" );
        this.quantity.div( amount );
        return this;
    }

    public static div(a: ExtendedAsset, b: ExtendedAsset | number | bigint | BigInteger ): ExtendedAsset {
        const contract = getContract( a );

        if ( contract ) check( a.contract.raw().equals( contract.raw() ), "type mismatch" );
        const result = new ExtendedAsset( a.quantity, a.contract );
        result.div( b );
        return result;
    }

    // Subtraction operator
    public minus( a: ExtendedAsset | number | bigint | BigInteger ): ExtendedAsset {
        const amount = getAmount( a );
        const contract = getContract( a );

        if ( contract ) check( contract.raw().equals( this.contract.raw() ), "type mismatch" );
        this.quantity.minus( amount );
        return this;
    }

    public static minus(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        const contract = getContract( a );

        if ( contract ) check( a.contract.raw().equals( contract.raw() ), "type mismatch" );
        const result = new ExtendedAsset( a.quantity, a.contract );
        result.minus( b );
        return result;
    }

    // Addition operator
    public plus( a: ExtendedAsset | number | bigint ): ExtendedAsset {
        const amount = getAmount( a );
        const contract = getContract( a );

        if ( contract ) check( contract.raw().equals( this.contract.raw() ), "type mismatch" );
        this.quantity.plus( amount );
        return this;
    }

    public static plus(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        const contract = getContract( a );

        if ( contract ) check( a.contract.raw().equals( contract.raw() ), "type mismatch" );
        const result = new ExtendedAsset( a.quantity, a.contract );
        result.plus( b );
        return result;
    }

    /// Less than operator
    public isLessThan( a: ExtendedAsset ): boolean {
        check( a.contract.raw().equals(this.contract.raw()), "type mismatch" );
        return this.quantity.isLessThan( a.quantity );
    }

    public static isLessThan( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract.raw().equals(b.contract.raw()), "type mismatch" );
        return a.quantity.isLessThan( b.quantity );
    }

    /// Comparison operator
    public isEqual( a: ExtendedAsset ): boolean {
        return this.quantity.isEqual( a.quantity ) && this.contract.isEqual( a.contract );
    }
    public static isEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        return a.quantity.isEqual( b.quantity ) && a.contract.isEqual( b.contract );
    }

    /// Comparison operator
    public isNotEqual( a: ExtendedAsset ): boolean {
        return this.quantity.isNotEqual( a.quantity ) || this.contract.isNotEqual( a.contract );
    }
    public static isNotEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        return a.quantity.isNotEqual( b.quantity ) || a.contract.isNotEqual( b.contract );
    }

    /// Comparison operator
    public isLessThanOrEqual( a: ExtendedAsset ): boolean {
        check( a.contract.raw().equals(this.contract.raw()), "type mismatch" );
        return this.quantity.isLessThanOrEqual( a.quantity );
    }

    public static isLessThanOrEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract.raw().equals(b.contract.raw()), "type mismatch" );
        return a.quantity.isLessThanOrEqual( b.quantity );
    }

    /// Comparison operator
    public isGreaterThanOrEqual( a: ExtendedAsset ): boolean {
        check( a.contract.raw().equals( this.contract.raw()), "type mismatch" );
        return this.quantity.isGreaterThanOrEqual( a.quantity );
    }

    public static isGreaterThanOrEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract.raw().equals( b.contract.raw()), "type mismatch" );
        return a.quantity.isGreaterThanOrEqual( b.quantity );
    }
}

export const extended_asset: {
    /**
     * Asset & Contract
     *
     * @example
     *
     * extended_asset( asset("1.0000 EOS"), name("eosio.token"))
     */
    ( a?: Asset, c?: Name ): ExtendedAsset;

    /**
     * Extended Symbol
     *
     * @example
     *
     * extended_asset( extended_symbol("4,EOS", "eosio.token") )
     */
    ( s?: ExtendedSymbol ): ExtendedAsset;

    /**
     * Contract
     *
     * @example
     *
     * extended_asset( name("eosio.token") )
     */
    ( c?: Name ): ExtendedAsset;

    /**
     * Value & Extended Symbol
     *
     * @example
     *
     * extended_asset( 10000, extended_symbol("4,EOS", "eosio.token"))
     */
    ( v?: number | bigint | BigInteger, s?: ExtendedSymbol ): ExtendedAsset;
} = ( obj1?: any, obj2?: any ) => {
    return new ExtendedAsset( obj1, obj2 );
}
