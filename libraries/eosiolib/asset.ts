// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/asset.hpp

import { Decimal } from "decimal.js";
import { Symbol } from "./symbol";
import * as eosio from "./core/eosio";

export class Asset {
    /**
     * {constexpr int64_t} Maximum amount possible for this asset. It's capped to 2^62 - 1
     */
    public static max_amount: number = 2 ** 62 - 1;

    /**
     * {int64_t} The amount of the asset
     */
    public amount: number = 0;

    /**
     * {symbol} The symbol name of the asset
     */
    public symbol: Symbol;

    /**
     * Asset Class
     *
     * @param {number} a The amount of the asset
     * @param {Symbol} sym  The name of the symbol
     * @returns {Asset} Asset
     * @example
     *
     * const quantity = new Asset(10000, new Symbol("EOS", 4));
     * quantity.toString() //=> "1.0000 EOS";
     * quantity.symbol.symbol //=> "EOS"
     * quantity.symbol.precision //=> 4
     */
    constructor(amount: number, sym: Symbol) {
        this.amount = amount;
        this.symbol = sym;

        eosio.check( this.is_amount_within_range(), "magnitude of asset amount must be less than 2^62" );
        // eosio.check( this.symbol.is_valid(), "invalid symbol name" );
    }

    /**
     * Check if the amount doesn't exceed the max amount
     *
     * @return true - if the amount doesn't exceed the max amount
     * @return false - otherwise
     */
    public is_amount_within_range(): boolean {
        return - Asset.max_amount <= this.amount && this.amount <= Asset.max_amount;
    }

    /**
     * Check if the asset is valid. %A valid asset has its amount <= max_amount and its symbol name valid
     *
     * @return true - if the asset is valid
     * @return false - otherwise
     */
    public is_valid(): boolean {
        // return this.is_amount_within_range() && this.symbol.is_valid();
        return true;
    }

    public toString() {
        const amount = this.toDecimal().toFixed(this.symbol.precision);

        return `${amount} ${this.symbol.code()}`;
    }

    public toDecimal() {
        return new Decimal(this.amount).div(Math.pow(10, this.symbol.precision));
    }

    public toNumber() {
        return this.toDecimal().toNumber();
    }
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
