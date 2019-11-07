// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/symbol.hpp

/**
 * @class Stores the symbol code
 * @brief Stores the symbol code as a uint64_t value
 */
export class SymbolCode {
    public value: number = 0; // uint64_t
}

export class Symbol {
    public precision: number;
    private _code: string;

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
    constructor(code: string, precision: number) {
        this._code = code;
        this.precision = precision;
    }

    public code() {
        return this._code;
    }

    public isEqual(comparison: Symbol) {
        return comparison.code === this.code && comparison.precision === this.precision;
    }
}
