// import { Decimal } from "decimal.js";
import { Symbol } from "./symbol";
import { Asset } from "./asset";

export function asset_to_bigint( quantity: Asset ): BigInt
{
    if ( quantity.amount == BigInt(0) ) return BigInt(0.0);
    return quantity.amount / BigInt(Math.pow(10, quantity.symbol.precision()));
}

export function bigint_to_asset( amount: number | BigInt, sym: Symbol ): Asset
{
    return new Asset( BigInt(amount) * BigInt(Math.pow(10, sym.precision())), sym );
}

export function asset_to_number( quantity: Asset ): number
{
    if ( Number(quantity.amount) == 0 ) return 0.0;
    return Number(quantity.amount) / Math.pow(10, quantity.symbol.precision());
}

export function number_to_asset( amount: number | BigInt, sym: Symbol ): Asset
{
    return new Asset( Number(amount) * Math.pow(10, sym.precision()), sym );
}