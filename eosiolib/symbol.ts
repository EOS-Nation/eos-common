import { check } from "./check";
import { SymbolCode } from "./symbol_code";
import { isNull } from "./utils";

// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/symbol.hpp

export class Symbol {
    public value = BigInt(0);

    /**
     * Symbol
     *
     * @name Symbol
     * @param {string} code Symbol Code
     * @param {number} precision Precision
     * @returns {Symbol} Symbol
     * @example
     *
     * const sym = new Symbol("EOS", 4);
     * sym.code() //=> "EOS"
     * sym.precision //=> 4
     */
    constructor(sc?: string | Symbol | SymbolCode | number | bigint, precision?: number | bigint) {
        if ( isNull(sc) && isNull( precision )) {
            this.value = BigInt(0);
        }
        else if ( typeof sc == "number" || typeof sc == "bigint" ) {
            this.value = BigInt(sc);
        }
        else if ( typeof sc == "string" ) {
            check( !isNull(precision), "[precision] is required");
            const symcode = new SymbolCode(sc).raw();
            this.value = BigInt(symcode) << BigInt(8) | BigInt(precision);
        }
        else if ( typeof sc == "object" ) {
            check( !isNull(precision), "[precision] is required");
            const symcode: any = sc;
            this.value = BigInt(symcode.raw()) << BigInt(8) | BigInt(precision);
        } else {
            check( false, "invalid symbol parameters");
        }
    }

    /**
     * Is this symbol valid
     */
    public is_valid(): boolean {
        return this.code().is_valid();
    }

    /**
     * This symbol's precision
     */
    public precision(): number {
        return Number(this.value & BigInt(0x00000000000000FF));
    }

    /**
     * Returns representation of symbol name
     */
    public code(): SymbolCode {
        return new SymbolCode(this.value >> BigInt(8) );
    }

    /**
     * Returns uint64_t repreresentation of the symbol
     */
    public raw(): bigint {
        return this.value;
    }

    /**
     * Explicit cast to bool of the symbol
     *
     * @return Returns true if the symbol is set to the default value of 0 else true.
     */
    public bool(): boolean {
        return this.value != BigInt(0);
    }

    /**
     * Equivalency operator. Returns true if a == b (are the same)
     *
     * @return boolean - true if both provided symbol_codes are the same
     */
    public static isEqual( a: Symbol, b: Symbol ): boolean {
        return a.raw() == b.raw();
    }

    public isEqual( a: Symbol ): boolean {
        return a.raw() == this.raw();
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided symbol_codes are not the same
     */
    public static isNotEqual( a: Symbol, b: Symbol ): boolean {
        return a.raw() != b.raw();
    }

    public isNotEqual( a: Symbol ): boolean {
        return a.raw() != this.raw();
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if symbol_code `a` is less than `b`
     */
    public static isLessThan( a: Symbol, b: Symbol ): boolean {
        return a.raw() < b.raw();
    }

    public isLessThan( a: Symbol ): boolean {
        return this.raw() < a.raw();
    }
}

export function symbol( sc?: string | SymbolCode | number | bigint, precision?: number | bigint ): Symbol {
    return new Symbol( sc, precision );
}
