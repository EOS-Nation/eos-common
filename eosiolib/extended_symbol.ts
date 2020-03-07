import { Name } from "./name";
import { Symbol } from "./symbol";

/**
 * @class Stores the extended_symbol
 * @brief Stores the extended_symbol as a uint64_t value
 */
export class ExtendedSymbol {
    private sym = new Symbol();
    private contract = new Name();

    /**
     * Construct a new symbol_code object initialising symbol and contract with the passed in symbol and name
     *
     * @param sym - The symbol
     * @param con - The name of the contract
     */
    constructor ( sym?: Symbol | null, contract?: Name | null ) {
        if ( sym ) this.sym = sym;
        if ( contract ) this.contract = contract;
    }

    /**
     * Returns the symbol in the extended_contract
     *
     * @return symbol
     */
    public get_symbol(): Symbol { return this.sym; }

    /**
     * Returns the name of the contract in the extended_symbol
     *
     * @return name
     */
    public get_contract(): Name { return this.contract; }

    /**
     * %Print the extended symbol
     *
     * @brief %Print the extended symbol
     */
    public print( show_precision = true ): void {
        this.sym.print( show_precision );
        process.stdout.write("@" + this.contract.to_string() );
    }

    /**
     * Equivalency operator. Returns true if a == b (are the same)
     *
     * @return boolean - true if both provided name are the same
     */
    public static isEqual( a: ExtendedSymbol, b: ExtendedSymbol ): boolean {
        return a.get_contract().raw() == b.get_contract().raw() && a.get_symbol().raw() == b.get_symbol().raw();
    }

    public isEqual( a: ExtendedSymbol ): boolean {
        return a.get_contract().raw() == this.get_contract().raw() && a.get_symbol().raw() == this.get_symbol().raw();
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided name are not the same
     */
    public static isNotEqual( a: ExtendedSymbol, b: ExtendedSymbol ): boolean {
        return a.get_contract().raw() != b.get_contract().raw() || a.get_symbol().raw() != b.get_symbol().raw();
    }

    public isNotEqual( a: ExtendedSymbol ): boolean {
        return a.get_contract().raw() != this.get_contract().raw() || a.get_symbol().raw() != this.get_symbol().raw();
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if name `a` is less than `b`
     */
    public static isLessThan( a: ExtendedSymbol, b: ExtendedSymbol ): boolean {
        return a.get_contract().raw() < b.get_contract().raw() || a.get_symbol().raw() < b.get_symbol().raw();
    }

    public isLessThan( a: ExtendedSymbol ): boolean {
        return this.get_contract().raw() < a.get_contract().raw() || this.get_symbol().raw() < a.get_symbol().raw();
    }
}

export function extended_symbol( sym?: Symbol | null, contract?: Name | null ): ExtendedSymbol {
    return new ExtendedSymbol( sym, contract );
}
