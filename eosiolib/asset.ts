// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/asset.hpp

import { Decimal } from "decimal.js";
import { Symbol } from "./symbol";
import * as eosio from "./core/eosio";

/**
 * Asset
 *
 * @name Asset
 * @param {number} amount The amount of the asset
 * @param {Symbol} sym  The name of the symbol
 * @returns {Asset} Asset
 * @example
 *
 * const quantity = new Asset(10000, new Symbol("EOS", 4));
 * quantity.toString() //=> "1.0000 EOS";
 * quantity.symbol.code() //=> "EOS"
 * quantity.symbol.precision //=> 4
 */
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

    public toDecimal(): Decimal {
        return new Decimal(this.amount).div(Math.pow(10, this.symbol.precision));
    }

    public toNumber() {
        return this.toDecimal().toNumber();
    }
}
