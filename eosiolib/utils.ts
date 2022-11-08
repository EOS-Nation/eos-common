import { Sym } from "./symbol";
import { Asset } from "./asset";
import { ExtendedAsset } from "./extended_asset";
import bigInt, { BigInteger } from "big-integer";
import { Name } from "./name";
import { ExtendedSymbol } from "./extended_symbol";

export function getType( obj: any ): string {
    if ( typeof obj == "object" && obj.typeof ) return obj.typeof;
    return typeof obj;
}

export function number_to_bigint( num: number | string ): BigInteger {
    if ( typeof num == "string") return bigInt( num.replace(".", "") );
    return bigInt( Math.floor( Number(num.toFixed(0)) ) );
}

export function isNull( value: any ): boolean {
    return value == undefined || value == null
}

export function getAmount( obj: any ): BigInteger {
    if ( obj.typeof == "asset" ) return obj.amount;
    if ( obj.typeof == "extended_asset") return obj.quantity.amount;
    if ( bigInt.isInstance( obj )) return obj;
    if ( typeof obj == "number" ) return number_to_bigint( obj );
    if ( typeof obj == "bigint" ) return bigInt( obj );
    if ( typeof obj == "string" ) return number_to_bigint( obj );
    throw new Error("invalid getAmount param");
}

export function getSymbol( obj: any ): Sym | null {
    if ( obj.typeof == "symbol") return obj;
    if ( obj.typeof == "asset") return obj.symbol;
    if ( obj.typeof == "extended_asset") return obj.quantity.symbol;
    return null
}

export function getContract( obj: any ): Name | null {
    if ( obj.typeof == "extended_asset") return obj.contract;
    if ( obj.typeof == "extended_symbol") return obj.get_contract();
    return null;
}

export function getQuantity( obj: any ): Asset | null {
    if ( obj.typeof == "extended_asset") return obj.quantity;
    if ( obj.typeof == "asset") return obj;
    return null;
}

export function asset_to_number( quantity: Asset | ExtendedAsset ): number
{
    const amount = getAmount( quantity );
    if ( amount == bigInt(0) ) return Number(amount);
    const sym = getSymbol(quantity);
    if ( sym ) return Number(amount) / Math.pow(10, sym.precision());
    throw new Error("invalid quantity");
}

export function number_to_asset( num: number | bigint | BigInteger, sym: Sym | ExtendedSymbol ): Asset
{
    const symbol = getSymbol(sym);
    if ( !symbol ) throw new Error("invalid sym");
    const exp = Math.pow( 10, symbol.precision() );

    if ( typeof num == "number" ) return new Asset( Math.floor(num * exp), symbol );
    return new Asset( getAmount( num ).multiply( exp ), symbol );
}

export function asset_to_precision( quantity: Asset, precision: number ): Asset
{
    return number_to_asset( asset_to_number( quantity ), new Sym( quantity.symbol.code(), precision ));
}