// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/symbol.hpp

/**
 * @class Stores the symbol code
 * @brief Stores the symbol code as a uint64_t value
 */
export class SymbolCode {

    private value: number = 0; // uint64_t
}

export class Symbol {
    public symbol: string;
    public precision: number;

    /**
     * Symbol Class
     *
     * @param {string} sym Symbol
     * @param {number} precision Precision
     * @returns {Symbol} Symbol
     * @example
     *
     * const sym = new Symbol("EOS", 4);
     * sym.symbol //=> "EOS"
     * sym.precision //=> 4
     */
    constructor(sym: string, precision: number) {
        this.symbol = sym;
        this.precision = precision;
    }
}

/**
 * Symbol
 *
 * @param {string} sym Symbol
 * @param {number} precision Precision
 * @returns {Symbol} Symbol
 * @example
 *
 * const sym = symbol("EOS", 4);
 * sym.symbol //=> "EOS"
 * sym.precision //=> 4
 */
export function symbol(sym: string, precision: number) {
    return new Symbol(sym, precision);
}
