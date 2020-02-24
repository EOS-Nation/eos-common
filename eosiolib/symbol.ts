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
    private _code: string;

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
    constructor(code: string, precision: number) {
        this._code = code;
        this._precision = precision;
    }

    public code(): string {
        return this._code;
    }

    public isEqual(comparison: Symbol): boolean {
        return comparison.code === this.code && comparison.precision() === this.precision();
    }

    public precision(): number {
        return this._precision;
    }
}

// const A = new symbol_code("A");
// const AB = new symbol_code("AB");
// const ABC = new symbol_code("ABC");
// const ABCD = new symbol_code("ABCD");
// const ABCDE = new symbol_code("ABCDE");
// const ABCDEF = new symbol_code("ABCDEF");
// const ABCDEFG = new symbol_code("ABCDEFG");

// console.log(A.raw());
// console.log(AB.raw());
// console.log(ABC.raw());
// console.log(ABCD.raw());
// console.log(ABCDE.raw());
// console.log(ABCDEF.raw());
// console.log(ABCDEFG.raw());

// console.log(new symbol_code("A").is_valid());
// console.log(new symbol_code("A1").is_valid());

// console.log(A.to_string());
// console.log(AB.to_string());
// console.log(ABC.to_string());
// console.log(ABCD.to_string());
// console.log(ABCDE.to_string());
// console.log(ABCDEF.to_string());
// console.log(ABCDEFG.to_string());
// console.log(ABCDEFG.raw());

console.log("XBCDEFG =>", write_as_string(20061986658402904));
console.log("ABCDEFA =>", write_as_string(18373136798138945));
console.log("BBCDEFA =>", write_as_string(18373136798138946));

console.log("BCDEFA =>", write_as_string(71770065617730));
console.log("ACDEFA =>", write_as_string(71770065617729));
console.log("XCDEFA =>", write_as_string(71770065617752));
