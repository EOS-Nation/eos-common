import { Decimal } from "decimal.js";

export class Symbol {
    public symbol: string;
    public precision: number;

    /**
     * Symbol Class
     *
     * @param {string} symbol Symbol
     * @param {number} precision Precision
     * @returns {Symbol} Symbol
     * @example
     *
     * const sym = new Symbol("EOS", 4);
     * sym.symbol //=> "EOS"
     * sym.precision //=> 4
     */
    constructor(symbol: string, precision: number) {
        this.symbol = symbol;
        this.precision = precision;
    }
}

/**
 * Symbol
 *
 * @param {string} symbol Symbol
 * @param {number} precision Precision
 * @returns {Symbol} Symbol
 * @example
 *
 * const sym = symbol("EOS", 4);
 * sym.symbol //=> "EOS"
 * sym.precision //=> 4
 */
export function symbol(symbol: string, precision: number) {
    return new Symbol(symbol, precision);
}

export class Asset {
    public amount: number;
    public symbol: Symbol;

    /**
     * Asset Class
     *
     * @param {number} amount Amount (uint64_t)
     * @param {Symbol} symbol Symbol
     * @returns {Asset} Asset
     * @example
     *
     * const quantity = new Asset(10000, new Symbol("EOS", 4));
     * quantity.toString() //=> "1.0000 EOS";
     * quantity.symbol.symbol //=> "EOS"
     * quantity.symbol.precision //=> 4
     */
    constructor (amount: number, symbol: Symbol) {
        this.amount = amount;
        this.symbol = symbol;
    }

    public toString() {
        const amount = this.toDecimal().toFixed(this.symbol.precision);
        const symbol = `${this.symbol.symbol}`;

        return `${amount} ${symbol}`;
    }

    public toDecimal() {
        return new Decimal(this.amount).div(Math.pow(10, this.symbol.precision));
    }

    public toNumber() {
        return this.toDecimal().toNumber();
    }
}

/**
 * Asset
 *
 * @param {number} amount Amount (uint64_t)
 * @param {Symbol} symbol Symbol
 * @returns {Asset} Asset
 * @example
 *
 * const quantity = asset(10000, new Symbol("EOS", 4));
 * quantity.toString() //=> "1.0000 EOS";
 * quantity.symbol.symbol //=> "EOS"
 * quantity.symbol.precision //=> 4
 */
export function asset(amount: number, symbol: Symbol) {
    return new Asset(amount, symbol);
}

/**
 * Split quantity string
 *
 * @param {string} quantity Quantity string
 * @returns {Asset}
 * @example
 *
 * const quantity = split("1.0000 EOS");
 * quantity.amount //=> 10000
 * quantity.symbol.precision() //=> 4
 * quantity.symbol.symbol() //=> "EOS"
 */
export function split(quantity: string): Asset {
    const [amount, symbol] = quantity.split(" ");
    const precision = (amount.split(".")[1] || []).length;
    const amount_uint64 = new Decimal(amount).times(new Decimal(10).pow(precision)).toNumber();

    return new Asset(amount_uint64, new Symbol(symbol, precision));
}