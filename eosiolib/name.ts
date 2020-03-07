import { check } from "./check";

/**
 *  Converts a %name Base32 symbol into its corresponding value
 *
 *  @param c - Character to be converted
 *  @return constexpr char - Converted value
 */
function char_to_value( c: string ): bigint {
    if ( c == '.')
        return BigInt(0);
    else if( c >= '1' && c <= '5' )
        return BigInt(c.charCodeAt(0) - '1'.charCodeAt(0)) + BigInt(1);
    else if( c >= 'a' && c <= 'z' )
        return BigInt(c.charCodeAt(0) - 'a'.charCodeAt(0)) + BigInt(6);
    else
        check( false, "character is not in allowed character set for names" );

    return BigInt(0); // control flow will never reach here; just added to suppress warning
}

function str_to_name( str?: string | number | bigint ): bigint {
    let value = BigInt(0);
    if ( typeof str == "number" || typeof str == "bigint" ) {
        return BigInt( str );
    }
    else if ( str && str.length > 13 ) check( false, "string is too long to be a valid name" );
    else if ( str == undefined || str == null || str.length == 0 ) return value;

    const n = BigInt(Math.min(str.length, 12 ));
    for( let i = 0; i < n; ++i ) {
       value <<= BigInt( 5 );
       value |= char_to_value( str[i] );
    }
    value <<= ( BigInt(4) + BigInt(5) * (BigInt(12) - n) );
    if ( str.length == 13 ) {
       const v = char_to_value(str[12]);
       if ( v > 0x0Fn ) {
          check(false, "thirteenth character in name cannot be a letter that comes after j");
       }
       value |= v;
    }
    return value;
}

/**
 * @class Stores the name
 * @brief Stores the name as a uint64_t value
 */
export class Name {
    readonly value = BigInt(0);

    constructor( str?: string | number | bigint ) {
        this.value = str_to_name( str );
     }

    public raw(): bigint {
        return this.value;
    }

    // public isTruthy(): boolean {
    //     return this.value != BigInt(0);
    // }

    // public isFalsy(): boolean {
    //     return this.value == BigInt(0);
    // }

    // public length(): number {
    //     let sym = BigInt(this.value);
    //     let len = 0;
    //     while (Number(sym) & 0xFF && len <= 7) {
    //        len++;
    //        sym >>= BigInt(8);
    //     }
    //     return len;
    //  }

    // public to_string(): string {
    //     return write_as_string(BigInt(this.value));
    // }

    // public is_valid(): boolean {
    //     let sym = BigInt(this.value);
    //     for ( let i = BigInt(0); i < 7; i++ ) {
    //        const c = String.fromCharCode(Number(BigInt(sym) & BigInt(0xFF)));
    //        if ( !("A" <= c && c <= "Z") ) return false;
    //        sym >>= BigInt(8);
    //        if ( !(BigInt(sym) & BigInt(0xFF)) ) {
    //           do {
    //              sym >>= BigInt(8);
    //              if ( (BigInt(sym) & BigInt(0xFF)) ) return false;
    //              i++;
    //           } while( i < 7 );
    //        }
    //     }
    //     return true;
    // }

    // /**
    //  * Equivalency operator. Returns true if a == b (are the same)
    //  *
    //  * @return boolean - true if both provided symbol_codes are the same
    //  */
    // public isEqual(comparison: SymbolCode): boolean {
    //     return comparison.value === this.value;
    // }

    // /**
    //  * Inverted equivalency operator. Returns true if a != b (are different)
    //  *
    //  * @return boolean - true if both provided symbol_codes are not the same
    //  */
    // public isNotEqual(comparison: SymbolCode): boolean {
    //     return comparison.value !== this.value;
    // }

    // /**
    //  * Less than operator. Returns true if a < b.
    //  * @brief Less than operator
    //  * @return boolean - true if symbol_code `a` is less than `b`
    //  */
    // public isLessThan(comparison: SymbolCode): boolean {
    //     return this.value < comparison.value;
    // }
}

export function name( str?: string | number | bigint ): Name {
    return new Name(str);
}

// const a = new Name("eosio")

// console.log(a)
