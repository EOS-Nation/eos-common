import { Name } from "./name";
import { Asset } from "./asset";
import { ExtendedSymbol } from "./extended_symbol";
import { check } from "./check";

/**
 * @class Stores the extended_asset
 * @brief Stores the extended_asset as a uint64_t value
 */
export class ExtendedAsset {
    get [Symbol.toStringTag](): string {
        return 'extended_asset';
    }
    public get typeof(): string { return 'extended_asset' }

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
     * Construct a new symbol_code object initialising symbol and contract with the passed in symbol and name
     *
     * @param sym - The symbol
     * @param con - The name of the contract
     */
    //    /**
    //    * Construct a new extended asset given the amount and extended symbol
    //    */
    //   extended_asset( int64_t v, extended_symbol s ):quantity(v,s.get_symbol()),contract(s.get_contract()){}
    //   /**
    //    * Construct a new extended asset given the asset and owner name
    //    */
    //   extended_asset( asset a, name c ):quantity(a),contract(c){}
    constructor ( options: {
        amount?: number | bigint;
        ext_sym?: ExtendedSymbol;
        quantity?: Asset | string;
        contract?: Name | string;
    } = {} ) {
        if ( (typeof options.amount == "number" || typeof options.amount == "bigint") && options.ext_sym ) {
            this.quantity = new Asset( options.amount, options.ext_sym.get_symbol() )
            this.contract = options.ext_sym.get_contract();
        }
        if ( options.contract ) {
            this.contract = typeof options.contract == "string" ? new Name( options.contract ) : options.contract;
        }
        if ( options.quantity ) {
            this.quantity = typeof options.quantity == "string" ? new Asset( options.quantity ) : options.quantity;
        }
        if ( options.ext_sym ) {
            this.quantity = new Asset( 0, options.ext_sym.get_symbol() )
            this.contract = options.ext_sym.get_contract();
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
    public times(a: ExtendedAsset | number | bigint ): ExtendedAsset {
        let amount: bigint;
        if ( typeof a == "bigint" || typeof a == "number") {
            amount = BigInt(a);
        } else {
            check( a.contract.raw() == this.contract.raw(), "type mismatch" );
            amount = a.quantity.amount;
        }
        this.quantity.times( amount );
        return this;
    }

    public static times(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof b != "bigint" && typeof b != "number") check( a.contract.raw() == b.contract.raw(), "type mismatch" );
        const result = new ExtendedAsset({ quantity: a.quantity, contract: a.contract });
        result.times(b);
        return result;
    }

    // Division operator
    public div(a: ExtendedAsset | number | bigint ): ExtendedAsset {
        let amount: bigint;
        if ( typeof a == "bigint" || typeof a == "number") {
            amount = BigInt(a);
        } else {
            check( a.contract.raw() == this.contract.raw(), "type mismatch" );
            amount = a.quantity.amount;
        }
        this.quantity.div( amount );
        return this;
    }

    public static div(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof b != "bigint" && typeof b != "number") check( a.contract.raw() == b.contract.raw(), "type mismatch" );
        const result = new ExtendedAsset({ quantity: a.quantity, contract: a.contract });
        result.div(b);
        return result;
    }

    // Subtraction operator
    public minus( a: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof a == "bigint" || typeof a == "number") {
            this.quantity.minus( a );
        } else {
            check( a.contract.raw() == this.contract.raw(), "type mismatch" );
            this.quantity.minus( a.quantity );
        }
        return this;
    }

    public static minus(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof b != "bigint" && typeof b != "number") check( a.contract.raw() == b.contract.raw(), "type mismatch" );
        const result = new ExtendedAsset({ quantity: a.quantity, contract: a.contract });
        result.minus(b);
        return result;
    }

    // Addition operator
    public plus( a: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof a == "bigint" || typeof a == "number") {
            this.quantity.plus( a );
        } else {
            check( a.contract.raw() == this.contract.raw(), "type mismatch" );
            this.quantity.plus( a.quantity );
        }
        return this;
    }

    public static plus(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof b != "bigint" && typeof b != "number") check( a.contract.raw() == b.contract.raw(), "type mismatch" );
        const result = new ExtendedAsset({ quantity: a.quantity, contract: a.contract });
        result.plus(b);
        return result;
    }

    /// Less than operator
    public isLessThan( a: ExtendedAsset ): boolean {
        check( a.contract.raw() == this.contract.raw(), "type mismatch" );
        return this.quantity.isLessThan( a.quantity );
    }

    public static isLessThan( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract.raw() == b.contract.raw(), "type mismatch" );
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
        check( a.contract.raw() == this.contract.raw(), "type mismatch" );
        return this.quantity.isLessThanOrEqual( a.quantity );
    }

    public static isLessThanOrEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract.raw() == b.contract.raw(), "type mismatch" );
        return a.quantity.isLessThanOrEqual( b.quantity );
    }

    /// Comparison operator
    public isGreaterThanOrEqual( a: ExtendedAsset ): boolean {
        check( a.contract.raw() == this.contract.raw(), "type mismatch" );
        return this.quantity.isGreaterThanOrEqual( a.quantity );
    }

    public static isGreaterThanOrEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract.raw() == b.contract.raw(), "type mismatch" );
        return a.quantity.isGreaterThanOrEqual( b.quantity );
    }
}

export function extended_asset( options: {
    amount?: number | bigint;
    ext_sym?: ExtendedSymbol;
    quantity?: Asset | string;
    contract?: Name | string;
} = {} ): ExtendedAsset {
    return new ExtendedAsset( options );
}
