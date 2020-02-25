// import { Decimal } from "decimal.js";
import { Symbol } from "./symbol";
import { Asset } from "./asset";

/**
 * Split quantity string
 *
 * @param {string} quantity Quantity string
 * @returns {Asset}
 * @example
 *
 * const quantity = split("1.0000 EOS");
 * quantity.amount //=> 10000
 * quantity.symbol.precision //=> 4
 * quantity.symbol.code() //=> "EOS"
 */
export function split(quantity: string): Asset {
    const [amount, symbol] = quantity.split(" ");
    const precision = (amount.split(".")[1] || []).length;
    const amount_uint64 = Number(amount) * Math.pow(10, precision);

    return new Asset(amount_uint64, new Symbol(symbol, precision));
}

export function asset_to_double( quantity: Asset ): number
{
    if ( quantity.amount == 0 ) return 0.0;
    return quantity.amount / Math.pow(10, quantity.symbol.precision());
}

export function double_to_asset( amount: number, sym: Symbol ): Asset
{
    return new Asset( amount * Math.pow(10, sym.precision()), sym );
}