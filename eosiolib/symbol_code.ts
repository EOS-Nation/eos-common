import { check } from "./check";
import bigInt, { BigInteger } from "big-integer";

/**
 * @class Stores the symbol code
 * @brief Stores the symbol code as a uint64_t value
 */
export class SymbolCode {
    get [Symbol.toStringTag](): string {
        return 'symbol_code';
    }
    /**
     * The typeof operator returns a string indicating the type of the unevaluated operand.
     */
    public get typeof(): string { return 'symbol_code' }

    /**
     * The isinstance() function returns True if the specified object is of the specified type, otherwise False.
     */
    public static isInstance( obj: any ): boolean { return obj instanceof SymbolCode; }

    private value = bigInt(0);

    // constructor()
    constructor( str?: string | number | BigInteger ) {
        if (typeof str == "number" || typeof str == 'bigint') {
            this.value = bigInt(str);
        } else if ( str && typeof str == "string" ) {
            let value = bigInt(0);
            if ( str.length > 7 ) {
                check( false, "string is too long to be a valid symbol_code" );
            }
            for ( const itr of str.split("").reverse().join("") ) {
                if ( itr < 'A' || itr > 'Z') {
                    check( false, "only uppercase letters allowed in symbol_code string" );
                }
                value = value.shiftLeft(bigInt(8));
                value = value.or(bigInt(itr.charCodeAt(0)));
            }
            this.value = value;
        } else if ( typeof str == "object") {
            this.value = str;
        }
    }

    public raw(): BigInteger {
        return this.value;
    }

    public isTruthy(): boolean {
        return this.value.notEquals(0);
    }

    public isFalsy(): boolean {
        return this.value.equals(0);
    }

    public length(): number {
        let sym = this.value;
        let len = 0;
        while (Number(sym) & 0xFF && len <= 7) {
           len++;
           sym = sym.shiftRight(8);
        }
        return len;
     }

    /**
     * The toString() method returns the string representation of the object.
     */
    public toString(): string {
        return this.to_string();
    }

     public to_string(): string  {
        const mask = bigInt("0x00000000000000FF");
        if (this.value.equals(0)) return '';

        let begin = "";
        let v = bigInt(this.value);
        for( let i = 0; i < 7; ++i, v = v.shiftRight(8) ) {
            if ( v.equals(0) ) return begin;
            begin += String.fromCharCode(Number(v.and(mask)));
        }

        return begin;
    }

    public is_valid(): boolean {
        let sym = bigInt(this.value);
        for ( let i = 0; i < 7; i++ ) {
           const c = String.fromCharCode(Number(sym.and(0xFF)));
           if ( !("A" <= c && c <= "Z") ) return false;
           sym = sym.shiftRight(8);
           if ( sym.and(0xFF).equals(0) ) {
                do {
                    sym = sym.shiftRight(8);
                    if ( sym.and(0xFF).notEquals(0) ) return false;
                    i++;
                } while( i < 7 );
           }
        }
        return true;
    }

    /**
     * Equivalency operator. Returns true if a == b (are the same)
     *
     * @return boolean - true if both provided symbol_codes are the same
     */
    public isEqual(comparison: SymbolCode): boolean {
        return comparison.value.equals(this.value);
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided symbol_codes are not the same
     */
    public isNotEqual(comparison: SymbolCode): boolean {
        return comparison.value.notEquals(this.value);
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if symbol_code `a` is less than `b`
     */
    public isLessThan(comparison: SymbolCode): boolean {
        return this.value.lesser(comparison.value);
    }
}

export function symbol_code( str?: string | number | BigInteger ): SymbolCode {
    return new SymbolCode(str);
}
