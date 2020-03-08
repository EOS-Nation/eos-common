import { check } from "./check";

/**
 * @class Stores the symbol code
 * @brief Stores the symbol code as a uint64_t value
 */
export class SymbolCode {
    get [Symbol.toStringTag](): string {
        return 'symbol_code';
    }

    private value = BigInt(0);

    // constructor()
    constructor( str?: string | number | bigint ) {
        if (typeof str == "number" || typeof str == 'bigint') {
            this.value = BigInt(str);
        } else if ( str ) {
            let value = BigInt(0);
            if ( str.length > 7 ) {
                check( false, "string is too long to be a valid symbol_code" );
            }
            for ( const itr of str.split("").reverse().join("") ) {
                if ( itr < 'A' || itr > 'Z') {
                    check( false, "only uppercase letters allowed in symbol_code string" );
                }
                value <<= BigInt(8);
                value |= BigInt(itr.charCodeAt(0));
            }
            this.value = value;
        }
    }

    public raw(): bigint {
        return this.value;
    }

    public isTruthy(): boolean {
        return this.value != BigInt(0);
    }

    public isFalsy(): boolean {
        return this.value == BigInt(0);
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

    public to_string(): string  {
        const mask = BigInt(0x00000000000000FF);
        if (this.value == BigInt(0)) return '';

        let begin = "";
        let v = BigInt(this.value);
        for( let i = 0; i < 7; ++i, v >>= BigInt(8) ) {
            if ( v == BigInt(0) ) return begin;
            begin += String.fromCharCode(Number(v & mask));
        }

        return begin;
    }

    public is_valid(): boolean {
        let sym = BigInt(this.value);
        for ( let i = BigInt(0); i < 7; i++ ) {
           const c = String.fromCharCode(Number(BigInt(sym) & BigInt(0xFF)));
           if ( !("A" <= c && c <= "Z") ) return false;
           sym >>= BigInt(8);
           if ( !(BigInt(sym) & BigInt(0xFF)) ) {
              do {
                 sym >>= BigInt(8);
                 if ( (BigInt(sym) & BigInt(0xFF)) ) return false;
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
        return comparison.value === this.value;
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided symbol_codes are not the same
     */
    public isNotEqual(comparison: SymbolCode): boolean {
        return comparison.value !== this.value;
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if symbol_code `a` is less than `b`
     */
    public isLessThan(comparison: SymbolCode): boolean {
        return this.value < comparison.value;
    }
}

export function symbol_code( str?: string | number | bigint ): SymbolCode {
    return new SymbolCode(str);
}
