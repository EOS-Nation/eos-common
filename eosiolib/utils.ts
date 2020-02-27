// import { Decimal } from "decimal.js";
import { Symbol } from "./symbol";
import { Asset } from "./asset";

export function asset_to_bigint( quantity: Asset ): bigint
{
    if ( quantity.amount == BigInt(0) ) return BigInt(0.0);
    return BigInt(quantity.amount) / BigInt( Math.pow(10, quantity.symbol.precision()) );
}

export function bigint_to_asset( amount: number | bigint, sym: Symbol ): Asset
{
    return new Asset( BigInt(amount) * BigInt(Math.pow(10, sym.precision())), sym );
}

export function asset_to_number( quantity: Asset ): number
{
    if ( Number(quantity.amount) == 0 ) return 0.0;
    return Number(quantity.amount) / Math.pow(10, quantity.symbol.precision());
}

export function number_to_asset( amount: number, sym: Symbol ): Asset
{
    return new Asset( amount * Math.pow(10, sym.precision()), sym );
}

export function number_to_bigint( num: number ): bigint {
    return BigInt( num.toFixed(0) );
}

// (() => {
//     const asset = number_to_asset(3.6587120707054996, new Symbol("EOS", 4));
// })();