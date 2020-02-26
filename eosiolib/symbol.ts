import { check } from "./check";
import { SymbolCode } from "./symbol_code";

// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/symbol.hpp

export class Symbol {
    public value: BigInt = BigInt(0);

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
    constructor(sc?: string | SymbolCode | number | BigInt, precision?: number) {
        if ( sc != undefined ) check( precision != undefined, "[precision] is required");

        if (typeof sc == "string" && precision) {
            const symcode = new SymbolCode(sc).raw();
            this.value = BigInt(symcode) << BigInt(8) | BigInt(precision);
        }
        else if (typeof sc == "number" || typeof sc == "bigint") {
            this.value = BigInt(sc);
        }
        else if (typeof sc == typeof SymbolCode) {
            const symcode: any = sc;
            this.value = BigInt(symcode.raw()) << BigInt(8) | BigInt(precision);
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
        return Number(BigInt(this.value) & BigInt(0x00000000000000FF));
    }

    /**
     * Returns representation of symbol name
     */
    public code(): SymbolCode {
        return new SymbolCode(BigInt(this.value) >> BigInt(8));
    }

    /**
     * Returns uint64_t repreresentation of the symbol
     */
    public raw(): BigInt {
        return this.value;
    }

    public isTruthy(): boolean {
        return this.value != BigInt(0);
    }

    public isFalsy(): boolean {
        return this.value == BigInt(0);
    }

    /**
     * Equivalency operator. Returns true if a == b (are the same)
     *
     * @return boolean - true if both provided symbols are the same
     */
    public isEqual(comparison: Symbol): boolean {
        return comparison.value === this.value;
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided symbols are not the same
     */
    public isNotEqual(comparison: Symbol): boolean {
        return comparison.value !== this.value;
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if symbol `a` is less than `b`
     */
    public isLessThan(comparison: Symbol): boolean {
        return this.value < comparison.value;
    }
}

export function symbol(sc?: number | string | SymbolCode, precision?: number): Symbol {
    return new Symbol(sc, precision);
}

// (() => {
//     console.log("EOSDT", "=>", symbol("EOSDT", 8).code().to_string());
//     console.log("EBTC", "=>", symbol("EBTC", 8).code().to_string());
//     console.log("USDE", "=>", symbol("USDE", 4).code().to_string());
//     console.log("USDT", "=>", symbol("USDT", 4).code().to_string());
// })();

// (() => {
//     console.log(typeof new SymbolCode)
//     console.log(typeof new SymbolCode("EOS"))
//     console.log(symbol("A", 4).raw());
//     console.log(symbol("AB", 4).raw());
//     console.log(symbol("ABC", 4).raw());
//     console.log(symbol("ABCD", 4).raw());
//     console.log(symbol("ABCDE", 4).raw());
//     console.log(symbol("ABCDEF", 4).raw());
//     console.log(symbol("ABCDEFG", 4).raw());
// })();