// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/asset.hpp

import { Symbol } from "./symbol";
import { check } from "./check";
import { asset_to_number } from "./utils";

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
    public static max_amount = BigInt(2 ** 62 - 1);

    /**
     * {int64_t} The amount of the asset
     */
    public amount = BigInt(0);

    /**
     * {symbol} The symbol name of the asset
     */
    public symbol: Symbol;

    constructor(amount?: string | number | BigInt, sym?: Symbol) {
        if ( typeof amount == "string") {
            const [amount_str, symbol_str] = amount.split(" ");
            const precision = (amount_str.split(".")[1] || []).length;
            this.amount = BigInt( Math.round(Number(amount_str) * Math.pow(10, precision)));
            this.symbol = new Symbol( symbol_str, precision );
        } else if ( sym ) {
            this.amount = BigInt(amount);
            this.symbol = sym;
        } else {
            throw new Error("[sym] is required");
        }

        check( this.is_amount_within_range(), "magnitude of asset amount must be less than 2^62" );
        check( this.symbol.is_valid(), "invalid symbol name" );
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
        return this.is_amount_within_range() && this.symbol.is_valid();
    }

    public to_string(): string {
        const fixed = asset_to_number(this).toFixed(this.symbol.precision());
        return `${fixed} ${this.symbol.code().to_string()}`;
    }
}

export function asset(amount?: number | BigInt, sym?: Symbol): Asset {
    return new Asset( amount, sym );
}

// (() => {
//     const quantity = new Asset("9643.4600 USD");
//     console.log(quantity);
// })()