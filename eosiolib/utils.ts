import { Decimal } from "decimal.js";
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
    const amount_uint64 = new Decimal(amount).times(new Decimal(10).pow(precision)).toNumber();

    return new Asset(amount_uint64, new Symbol(symbol, precision));
}
