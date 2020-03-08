import { Name } from "./name";
import { Asset } from "./asset";
import { ExtendedSymbol } from "./extended_symbol";
import { Sym } from "./symbol";
import { check } from "./check";

/**
 * @class Stores the extended_asset
 * @brief Stores the extended_asset as a uint64_t value
 */
export class ExtendedAsset {
    get [Symbol.toStringTag](): string {
        return 'extended_asset';
    }

    /**
     * The asset
     */
    private quantity = new Asset();

    /**
     * The owner of the asset
     */
    private contract = new Name();

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
    constructor ( options: {
        amount?: number | bigint;
        ext_sym?: ExtendedSymbol;
        quantity?: Asset | string;
        contract?: Name | string;
    } = {}) {
        if ( (typeof options.amount == "number" || typeof options.amount == "bigint") && options.ext_sym ) {
            this.quantity = new Asset( options.amount, options.ext_sym.get_symbol() )
            this.contract = options.ext_sym.get_contract();
        } else if ( options.quantity && options.contract ) {
            this.quantity = typeof options.quantity == "string" ? new Asset( options.quantity ) : options.quantity;
            this.contract = typeof options.contract == "string" ? new Name( options.contract ) : options.contract;
        } else {
            check(false, "invalid params");
        }
    }

    /**
     * Returns the symbol in the extended_contract
     *
     * @return symbol
     */
    public get_symbol(): Sym { return this.quantity.symbol; }

    /**
     * Returns the name of the contract in the extended_asset
     *
     * @return name
     */
    public get_contract(): Name { return this.contract; }

    /**
     * %Print the extended asset
     */
    public print(): void {
        this.quantity.print();
        process.stdout.write("@" + this.contract.to_string());
    }

    /// @cond OPERATORS

    // Multiplication assignment operator
    public times(a: ExtendedAsset | number | bigint ): ExtendedAsset {
        let amount: bigint;
        if ( typeof a == "bigint" || typeof a == "number") {
            amount = BigInt(a);
        } else {
            check( a.contract == this.contract, "type mismatch" );
            amount = a.quantity.amount;
        }
        this.quantity.times( amount );
        return this;
    }

    public static times(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof b != "bigint" && typeof b != "number") check( a.contract == b.contract, "type mismatch" );
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
            check( a.contract == this.contract, "type mismatch" );
            amount = a.quantity.amount;
        }
        this.quantity.div( amount );
        return this;
    }

    public static div(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof b != "bigint" && typeof b != "number") check( a.contract == b.contract, "type mismatch" );
        const result = new ExtendedAsset({ quantity: a.quantity, contract: a.contract });
        result.div(b);
        return result;
    }

    // Subtraction operator
    public minus( a: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof a == "bigint" || typeof a == "number") {
            this.quantity.minus( a );
        } else {
            check( a.contract == this.contract, "type mismatch" );
            this.quantity.minus( a.quantity );
        }
        return this;
    }

    public static minus(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof b != "bigint" && typeof b != "number") check( a.contract == b.contract, "type mismatch" );
        const result = new ExtendedAsset({ quantity: a.quantity, contract: a.contract });
        result.minus(b);
        return result;
    }

    // Addition operator
    public plus( a: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof a == "bigint" || typeof a == "number") {
            this.quantity.plus( a );
        } else {
            check( a.contract == this.contract, "type mismatch" );
            this.quantity.plus( a.quantity );
        }
        return this;
    }

    public static plus(a: ExtendedAsset, b: ExtendedAsset | number | bigint ): ExtendedAsset {
        if ( typeof b != "bigint" && typeof b != "number") check( a.contract == b.contract, "type mismatch" );
        const result = new ExtendedAsset({ quantity: a.quantity, contract: a.contract });
        result.plus(b);
        return result;
    }

    /// Less than operator
    public isLessThan( a: ExtendedAsset ): boolean {
        check( a.contract == this.contract, "type mismatch" );
        return this.quantity.isLessThan( a.quantity );
    }

    public static isLessThan( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract == b.contract, "type mismatch" );
        return a.quantity.isLessThan( b.quantity );
    }

    /// Comparison operator
    public isEqual( a: ExtendedAsset ): boolean {
        return this.quantity.isEqual( a.quantity ) && this.contract.isEqual( a.get_contract() );
    }
    public static isEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        return a.quantity.isEqual( b.quantity ) && a.contract.isEqual( b.get_contract() );
    }

    /// Comparison operator
    public isNotEqual( a: ExtendedAsset ): boolean {
        return this.quantity.isNotEqual( a.quantity ) && this.contract.isNotEqual( a.get_contract() );
    }
    public static isNotEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        return a.quantity.isNotEqual( b.quantity ) && a.contract.isNotEqual( b.get_contract() );
    }

    /// Comparison operator
    public isLessThanOrEqual( a: ExtendedAsset ): boolean {
        check( a.contract == this.contract, "type mismatch" );
        return this.quantity.isLessThanOrEqual( a.quantity );
    }

    public static isLessThanOrEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract == b.contract, "type mismatch" );
        return a.quantity.isLessThanOrEqual( b.quantity );
    }

    /// Comparison operator
    public isGreaterThanOrEqual( a: ExtendedAsset ): boolean {
        check( a.contract == this.contract, "type mismatch" );
        return this.quantity.isGreaterThanOrEqual( a.quantity );
    }

    public static isGreaterThanOrEqual( a: ExtendedAsset, b: ExtendedAsset ): boolean {
        check( a.contract == b.contract, "type mismatch" );
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

extended_asset({quantity: "1.0000 EOS", contract: "eosio.token"}).print()