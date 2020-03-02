// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/asset.hpp

import { Symbol, symbol } from "./symbol";
import { check } from "./check";
import { write_decimal } from "./eosiolib";
import { number_to_bigint, isNull } from "./utils";

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
    public static max_amount = (BigInt(1) << BigInt(62)) - BigInt(1);

    /**
     * {int64_t} The amount of the asset
     */
    public amount = BigInt(0);

    /**
     * {symbol} The symbol name of the asset
     */
    public symbol: Symbol = symbol();

    /**
     * Construct a new asset given the symbol name and the amount
     *
     * @param amount - The amount of the asset
     * @param sym - The name of the symbol
     */
    constructor ( amount?: string | number | bigint, sym?: Symbol ) {
        if ( isNull(amount) && isNull(sym) ) {
            return;
        }
        else if ( typeof amount == "string") {
            const [amount_str, symbol_str] = amount.split(" ");
            const precision = (amount_str.split(".")[1] || []).length;
            this.amount = number_to_bigint( Number(amount_str) * Math.pow(10, precision));
            this.symbol = new Symbol( symbol_str, precision );
        } else if ( sym ) {
            this.amount = (typeof amount == "number") ? number_to_bigint(amount) : BigInt(amount);
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
        return -BigInt(Asset.max_amount) <= BigInt(this.amount) && this.amount <= Asset.max_amount;
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

    /**
     * Set the amount of the asset
     *
     * @param a - New amount for the asset
     */
    public set_amount( amount: bigint | number ): void {
        this.amount = BigInt(amount);
        check( this.is_amount_within_range(), "magnitude of asset amount must be less than 2^62" );
    }

    /**
     * Unary minus operator
     *
     * @return asset - New asset with its amount is the negative amount of this asset
     */
    public minus( amount: bigint | number ): Asset {
        const r = new Asset( this.amount, this.symbol );
        r.amount -= BigInt(amount);
        return r;
    }

    public to_string(): string {
        const amount = write_decimal(this.amount, this.symbol.precision(), true);
        const symcode = this.symbol.code().to_string();
        return `${amount} ${symcode}`;
    }

}

export function asset( amount?: string | number | bigint, sym?: Symbol ): Asset {
    return new Asset( amount, sym );
}

// const asset_mask: bigint = (BigInt(1) << BigInt(62)) - BigInt(1);
// const asset_min: bigint = -asset_mask; // -4611686018427387903
// const asset_max: bigint = asset_mask; //  4611686018427387903
// const sym_no_prec = symbol("SYMBOLL", 0n); // Symbol with no precision
// const sym_prec = symbol("SYMBOLL", 63n);   // Symbol with precision

// console.log( "asset_min", asset_min );
// console.log( asset( asset_min, sym_no_prec ).to_string() )
// .toBe( "-4611686018427387903 SYMBOLL" )

// asset( asset_min - 1n, symbol() )

// (() => {
//     const quantity = new Asset(9643, new Symbol("USD", 4));
//     console.log(quantity);
// })()