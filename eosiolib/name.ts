import { check } from "./check";

/**
 * @class Stores the name
 * @brief Stores the name as a uint64_t value
 */
export class Name {
    get [Symbol.toStringTag](): string {
        return 'name';
    }

    public typeof(): string { return 'name' }

    readonly value = BigInt(0);

    constructor( str?: string | number | bigint ) {
        let value = BigInt(0);
        if ( typeof str == "number" || typeof str == "bigint" ) {
            this.value = BigInt( str );
            return;
        }
        else if ( str && str.length > 13 ) check( false, "string is too long to be a valid name" );
        else if ( str == undefined || str == null || str.length == 0 ) return;

        const n = Math.min(str.length, 12 );
        for( let i = 0; i < n; ++i ) {
           value <<= BigInt( 5 );
           value |= BigInt(Name.char_to_value( str[i] ));
        }
        value <<= BigInt( 4 + 5 * (12 - n) );
        if ( str.length == 13 ) {
           const v = Name.char_to_value(str[12]);
           if ( v > 0x0F ) {
              check(false, "thirteenth character in name cannot be a letter that comes after j");
           }
           value |= BigInt(v);
        }
        this.value = value;
    }

    /**
     *  Converts a %name Base32 symbol into its corresponding value
     *
     *  @param c - Character to be converted
     *  @return constexpr char - Converted value
     */
    public static char_to_value( c: string ): number {
        if ( c == '.')
            return 0;
        else if( c >= '1' && c <= '5' )
            return c.charCodeAt(0) - '1'.charCodeAt(0) + 1;
        else if( c >= 'a' && c <= 'z' )
            return c.charCodeAt(0) - 'a'.charCodeAt(0) + 6;
        else
            check( false, "character is not in allowed character set for names" );

        return 0; // control flow will never reach here; just added to suppress warning
    }

    /**
     *  Returns the length of the %name
     */
    public length(): number {
       const mask = BigInt(0xF800000000000000);

        if ( this.value == BigInt(0) )
           return 0;

        let l = 0;
        let i = 0;
        for ( let v = this.value; i < 13; ++i, v <<= BigInt(5) ) {
           if ( (v & mask) > 0 ) {
              l = i;
           }
        }

        return l + 1;
    }


    /**
     *  Returns the suffix of the %name
     */
    public suffix(): Name {
        let remaining_bits_after_last_actual_dot = BigInt(0);
        let tmp = BigInt(0);
        for( let remaining_bits = BigInt(59); remaining_bits >= BigInt(4); remaining_bits -= BigInt(5) ) { // Note: remaining_bits must remain signed integer
            // Get characters one-by-one in name in order from left to right (not including the 13th character)
            const c = (this.value >> remaining_bits) & BigInt(0x1F);
            if( !c ) { // if this character is a dot
                tmp = remaining_bits;
            } else { // if this character is not a dot
                remaining_bits_after_last_actual_dot = tmp;
            }
        }

        const thirteenth_character = this.value & BigInt(0x0F);
        if ( thirteenth_character ) { // if 13th character is not a dot
            remaining_bits_after_last_actual_dot = tmp;
        }

        if ( remaining_bits_after_last_actual_dot == BigInt(0) ) // there is no actual dot in the %name other than potentially leading dots
            return new Name(this.value);

        // At this point remaining_bits_after_last_actual_dot has to be within the range of 4 to 59 (and restricted to increments of 5).

        // Mask for remaining bits corresponding to characters after last actual dot, except for 4 least significant bits (corresponds to 13th character).
        const mask = (BigInt(1) << remaining_bits_after_last_actual_dot) - BigInt(16);
        const shift = BigInt(64) - remaining_bits_after_last_actual_dot;

        return new Name( ((this.value & mask) << shift) + (thirteenth_character << (shift - BigInt(1))) );
    }

    /**
     * Returns uint64_t repreresentation of the name
     */
    public raw(): bigint {
        return this.value;
    }

    /**
     * Explicit cast to bool of the name
     *
     * @return Returns true if the name is set to the default value of 0 else true.
     */
    public bool(): boolean {
        return this.value != BigInt(0);
    }

    /**
     *  Returns the name as a string.
     *
     *  @brief Returns the name value as a string by calling write_as_string() and returning the buffer produced by write_as_string()
     */
    public to_string(): string{
        const charmap = ".12345abcdefghijklmnopqrstuvwxyz";
        const mask = BigInt(0xF800000000000000);

        let begin = "";
        let v = this.value;
        const actual_end = this.length();
        for( let i = 0; i < 13; ++i, v <<= BigInt(5) ) {
            if ( v == BigInt(0) ) return begin;
            if ( i >= actual_end ) return begin;

            const indx = (v & mask) >> (i == 12 ? BigInt(60) : BigInt(59));
            begin += charmap[Number(indx)];
        }

        return begin;
    }

    /**
     * Equivalency operator. Returns true if a == b (are the same)
     *
     * @return boolean - true if both provided name are the same
     */
    public static isEqual( a: Name, b: Name ): boolean {
        return a.raw() == b.raw();
    }

    public isEqual( a: Name ): boolean {
        return a.raw() == this.raw();
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided name are not the same
     */
    public static isNotEqual( a: Name, b: Name ): boolean {
        return a.raw() != b.raw();
    }

    public isNotEqual( a: Name ): boolean {
        return a.raw() != this.raw();
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if name `a` is less than `b`
     */
    public static isLessThan( a: Name, b: Name ): boolean {
        return a.raw() < b.raw();
    }

    public isLessThan( a: Name ): boolean {
        return this.raw() < a.raw();
    }
}

export function name( str?: string | number | bigint ): Name {
    return new Name(str);
}
