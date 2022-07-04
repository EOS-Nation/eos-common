import { check } from "./check";
import bigInt, { BigInteger } from "big-integer";

/**
 * @class Stores the name
 * @brief Stores the name as a uint64_t value
 */
export class Name {
    get [Symbol.toStringTag](): string {
        return 'name';
    }
    /**
     * The typeof operator returns a string indicating the type of the unevaluated operand.
     */
    public get typeof(): string { return 'name' }

    /**
     * The isinstance() function returns True if the specified object is of the specified type, otherwise False.
     */
    public static isInstance( obj: any ): boolean { return obj instanceof Name; }

    readonly value = bigInt(0);

    constructor( str?: string | number | BigInteger ) {
        let value = bigInt(0);
        if ( typeof str == "number" || typeof str == "bigint" ) {
            this.value = bigInt( str );
            return;
        }
        if ( typeof str == "string" ) {
            if ( str.length > 13 ) check( false, "string is too long to be a valid name" );
            else if ( str == undefined || str == null || str.length == 0 ) return;

            const n = Math.min(str.length, 12 );
            for( let i = 0; i < n; ++i ) {
                value = value.shiftLeft( 5 );
                value = value.or( Name.char_to_value( str[i] ));
            }
            value = value.shiftLeft( 4 + 5 * (12 - n) );

            if ( str.length == 13 ) {
                const v = Name.char_to_value(str[12]);
                if ( v > 0x0F ) {
                    check(false, "thirteenth character in name cannot be a letter that comes after j");
                }
                value = value.or( v );
            }
            this.value = value;
        } else if ( typeof str == "object" ) {
            this.value = str;
        }
    }

    static from( str?: string | number | BigInteger ): Name {
        return new Name(str);
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
       const mask = bigInt(0xF800000000000000);

        if ( this.value.equals( 0 ) ) return 0;

        let l = 0;
        let i = 0;
        for ( let v = this.value; i < 13; ++i, v = v.shiftLeft(5) ) {
            if ( v.and(mask).greater(0) ) {
                l = i;
            }
        }

        return l + 1;
    }


    /**
     *  Returns the suffix of the %name
     */
    public suffix(): Name {
        let remaining_bits_after_last_actual_dot = bigInt(0);
        let tmp = bigInt(0);
        for( let remaining_bits = bigInt(59); remaining_bits.greaterOrEquals(4); remaining_bits = remaining_bits.minus(5) ) { // Note: remaining_bits must remain signed integer
            // Get characters one-by-one in name in order from left to right (not including the 13th character)
            const c = (this.value.shiftRight(remaining_bits)).and(0x1F);
            if( c.equals(0) ) { // if this character is a dot
                tmp = remaining_bits;
            } else { // if this character is not a dot
                remaining_bits_after_last_actual_dot = tmp;
            }
        }

        const thirteenth_character = this.value.and(0x0F);
        if ( thirteenth_character.notEquals(0) ) { // if 13th character is not a dot
            remaining_bits_after_last_actual_dot = tmp;
        }

        if ( remaining_bits_after_last_actual_dot.equals(0) ) // there is no actual dot in the %name other than potentially leading dots
            return new Name(this.value);

        // At this point remaining_bits_after_last_actual_dot has to be within the range of 4 to 59 (and restricted to increments of 5).

        // Mask for remaining bits corresponding to characters after last actual dot, except for 4 least significant bits (corresponds to 13th character).
        const mask = (bigInt(1).shiftLeft(remaining_bits_after_last_actual_dot)).minus(16);
        const shift = bigInt(64).minus(remaining_bits_after_last_actual_dot);

        return new Name( ((this.value.and(mask)).shiftLeft(shift)).plus(thirteenth_character.shiftLeft((shift.minus(1))) ));
    }

    /**
     * Returns uint64_t repreresentation of the name
     */
    public raw(): BigInteger {
        return this.value;
    }

    /**
     * Explicit cast to bool of the name
     *
     * @return Returns true if the name is set to the default value of 0 else true.
     */
    public bool(): boolean {
        return this.value.notEquals(0);
    }

    /**
     * The toString() method returns the string representation of the object.
     */
    public toString(): string {
        return this.to_string();
    }

    public to_string(): string{
        const charmap = ".12345abcdefghijklmnopqrstuvwxyz";
        const mask = bigInt(0xF800000000000000);

        let begin = "";
        let v = this.value;
        const actual_end = this.length();
        for( let i = 0; i < 13; ++i, v = v.shiftLeft(5) ) {
            if ( v.equals(0) ) return begin;
            if ( i >= actual_end ) return begin;

            const indx = (v.and(mask)).shiftRight(i == 12 ? 60 : 59);
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
        return a.raw().equals(b.raw());
    }

    public isEqual( a: Name ): boolean {
        return a.raw().equals(this.raw());
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided name are not the same
     */
    public static isNotEqual( a: Name, b: Name ): boolean {
        return a.raw().notEquals( b.raw() );
    }

    public isNotEqual( a: Name ): boolean {
        return a.raw().notEquals( this.raw() );
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if name `a` is less than `b`
     */
    public static isLessThan( a: Name, b: Name ): boolean {
        return a.raw().lesser( b.raw() );
    }

    public isLessThan( a: Name ): boolean {
        return this.raw().lesser( a.raw() );
    }
}

export function name( str?: string | number | BigInteger ): Name {
    return new Name(str);
}
