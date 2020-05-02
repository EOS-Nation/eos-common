import { Name } from "./name";
import { Sym } from "./symbol";
import { BigInteger } from "big-integer";

/**
 * @class Stores the extended_symbol
 * @brief Stores the extended_symbol as a uint64_t value
 */
export class ExtendedSymbol {
    get [Symbol.toStringTag](): string {
        return 'extended_symbol';
    }
    /**
     * The typeof operator returns a string indicating the type of the unevaluated operand.
     */
    public get typeof(): string { return 'extended_symbol' }

    /**
     * The isinstance() function returns True if the specified object is of the specified type, otherwise False.
     */
    public static isInstance( obj: any ): boolean { return obj instanceof ExtendedSymbol; }

    private sym = new Sym();
    private contract = new Name();

    /**
     * Construct a new symbol_code object initialising symbol and contract with the passed in symbol and name
     *
     * @param sym - The symbol
     * @param con - The name of the contract
     * @example
     *
     * new ExtendedSymbol( symbol("4,EOS"), name("eosio.token") )
     */
    constructor ( sym?: Sym | string, contract?: Name | string ) {
        if ( sym ) this.sym = typeof sym == "string" ? new Sym( sym ) : sym;
        if ( contract ) this.contract = typeof contract == "string" ? new Name( contract ) : contract;
    }

    /**
     * Returns the symbol in the extended_contract
     *
     * @return symbol
     */
    public get_symbol(): Sym { return this.sym; }

    /**
     * Returns the name of the contract in the extended_symbol
     *
     * @return name
     */
    public get_contract(): Name { return this.contract; }

    // /**
    //  * %Print the extended symbol
    //  *
    //  * @brief %Print the extended symbol
    //  */
    // public print( show_precision = true ): void {
    //     this.sym.print( show_precision );
    //     process.stdout.write("@" + this.contract.to_string() );
    // }

    /**
     * The toString() method returns the string representation of the object.
     */
    public toString( show_precision = true ): string {
        return `${this.sym.toString( show_precision )}@${this.contract.to_string()}`
    }

    /**
     * Returns uint128_t repreresentation of the extended symbol
     */
    public raw(): BigInteger {
        return this.contract.value.shiftLeft( 64 ).or( this.sym.code().raw() );
    }

    /**
     * Equivalency operator. Returns true if a == b (are the same)
     *
     * @return boolean - true if both provided name are the same
     */
    public static isEqual( a: ExtendedSymbol, b: ExtendedSymbol ): boolean {
        return a.get_contract().raw().equals( b.get_contract().raw() ) && a.get_symbol().raw().equals( b.get_symbol().raw() );
    }

    public isEqual( a: ExtendedSymbol ): boolean {
        return a.get_contract().raw().equals( this.get_contract().raw() ) && a.get_symbol().raw().equals( this.get_symbol().raw() );
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided name are not the same
     */
    public static isNotEqual( a: ExtendedSymbol, b: ExtendedSymbol ): boolean {
        return a.get_contract().raw().notEquals( b.get_contract().raw() ) || a.get_symbol().raw().notEquals( b.get_symbol().raw() );
    }

    public isNotEqual( a: ExtendedSymbol ): boolean {
        return a.get_contract().raw().notEquals( this.get_contract().raw() ) || a.get_symbol().raw().notEquals( this.get_symbol().raw() );
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if name `a` is less than `b`
     */
    public static isLessThan( a: ExtendedSymbol, b: ExtendedSymbol ): boolean {
        return a.get_contract().raw().lesser(b.get_contract().raw()) || a.get_symbol().raw().lesser(b.get_symbol().raw() );
    }

    public isLessThan( a: ExtendedSymbol ): boolean {
        return this.get_contract().raw().lesser(a.get_contract().raw()) || this.get_symbol().raw().lesser(a.get_symbol().raw() );
    }
}

/**
 * Extended Symbol
 *
 * @example
 *
 * extended_symbol( symbol("4,EOS"), name("eosio.token") )
 */
export function extended_symbol( sym?: Sym | string, contract?: Name | string ): ExtendedSymbol {
    return new ExtendedSymbol( sym, contract );
}
