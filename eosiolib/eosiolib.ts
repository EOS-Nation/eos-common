import { BigInteger } from "big-integer";

function repeat( str: string, count: number ): string {
    let result = "";
    for ( let i = 0; i < count; i++) {
        result += str;
    }
    return result;
}

/**
*  Writes a number as a string
*
*  @brief Writes number x 10^(-num_decimal_places) (optionally negative) as a string
*  @param number - The number to print before shifting the decimal point to the left by num_decimal_places.
*  @param num_decimal_places - The number of decimal places to shift the decimal point.
*  @param negative - Whether to print a minus sign in the front.
*/
export function write_decimal( number: BigInteger, num_decimal_places: number, negative: boolean ): string {
    let str = "";
    let num_digits = 0;
    let isNegative = false;

    for ( const num of number.toString().split("").reverse() ) {
        if ( num == "-" ) {
            isNegative = true;
            continue;
        }
        if ( num_decimal_places != 0 && num_decimal_places == num_digits ) str = "." + str;
        str = num + str;
        num_digits += 1;
    }

    if ( num_digits == num_decimal_places ) str = "0." + str;
    else if ( num_digits < num_decimal_places ) str = "0." + repeat("0", num_decimal_places - num_digits) + str;
    else if ( str[0] == "." ) str = "0" + str;

    if ( negative && isNegative ) str = "-" + str;
    return str;
}
