import { Sym } from "./symbol";
import { Asset } from "./asset";
import bigInt, { BigInteger } from "big-integer";

export function asset_to_bigint( quantity: Asset ): BigInteger
{
    if ( quantity.amount == bigInt(0) ) return bigInt(0.0);
    return bigInt(quantity.amount).divide( Math.pow(10, quantity.symbol.precision()) );
}

export function bigint_to_asset( amount: number | BigInteger, sym: Sym ): Asset
{
    return new Asset( amount, sym ).times(Math.pow(10, sym.precision()));
}

export function asset_to_number( quantity: Asset ): number
{
    if ( Number(quantity.amount) == 0 ) return 0.0;
    return Number(quantity.amount) / Math.pow(10, quantity.symbol.precision());
}

export function number_to_asset( amount: number, sym: Sym ): Asset
{
    return new Asset( amount * Math.pow(10, sym.precision()), sym );
}
