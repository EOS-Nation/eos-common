import { check } from "./check";

// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/symbol.hpp

function str_to_symbol_code( str: string ): number {
    let value = BigInt(0);
    if( str.length > 7 ) {
        check( false, "string is too long to be a valid symbol_code" );
    }
    for( const itr of str.split("").reverse().join("") ) {
        if( itr < 'A' || itr > 'Z') {
            check( false, "only uppercase letters allowed in symbol_code string" );
        }
        value <<= BigInt(8);
        value |= BigInt(itr.charCodeAt(0));
    }
    return Number(value);
}

function write_as_string( value: number ): string {

    const mask = BigInt(0x00000000000000FF);
    if (value == 0) return '';

    let begin = "";
    let v = BigInt(value);
    for( let i = 0; i < 7; ++i, v >>= BigInt(8) ) {
        if ( v == BigInt(0) ) return begin;
        begin += String.fromCharCode(Number(v & mask));
    }

    return begin;
}

/**
 * @class Stores the symbol code
 * @brief Stores the symbol code as a uint64_t value
 */
export class symbol_code {
    private value = 0; // uint64_t

    // constructor()
    constructor( str?: number | string ) {
        if ( str ) {
            if (typeof str == 'number') this.value = Number(str);
            else this.value = str_to_symbol_code(str);
        }
    }
    public raw(): number {
        return this.value;
    }

    public length(): number {
        let sym = BigInt(this.value);
        let len = 0;
        while (Number(sym) & 0xFF && len <= 7) {
           len++;
           sym >>= BigInt(8);
        }
        return len;
     }

    public to_string(): string {
        return write_as_string(this.value);
    }

    public is_valid(): boolean {
        let sym = BigInt(this.value);
        for ( let i=0; i < 7; i++ ) {
           const c = String.fromCharCode(Number(sym) & 0xFF);
           if ( !("A" <= c && c <= "Z") ) return false;
           sym >>= BigInt(8);
           if ( !(Number(sym) & 0xFF) ) {
              do {
                 sym >>= BigInt(8);
                 if ( (Number(sym) & 0xFF) ) return false;
                 i++;
              } while( i < 7 );
           }
        }
        return true;
     }

    public isEqual(comparison: symbol_code): boolean {
        return comparison.value === this.value;
    }
}

export class Symbol {
    public _precision: number;
    private _code: symbol_code;

    /**
     * Symbol
     *
     * @name Symbol
     * @param {string} code Symbol Code
     * @param {number} precision Precision
     * @returns {Symbol} Symbol
     * @example
     *
     * const sym = new Symbol("EOS", 4);
     * sym.code() //=> "EOS"
     * sym.precision //=> 4
     */
    constructor(code: string | symbol_code, precision: number) {
        this._code = (typeof code == "string") ? new symbol_code(code) : code;
        this._precision = precision;
    }

    public code(): symbol_code {
        return this._code;
    }

    public isEqual(comparison: Symbol): boolean {
        return comparison.code === this.code && comparison.precision() === this.precision();
    }

    public precision(): number {
        return this._precision;
    }
}
