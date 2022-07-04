import { check } from "./check";
import { SymbolCode } from "./symbol_code";
import bigInt, { BigInteger } from "big-integer";
import { isNull, getType } from "./utils";

export class Sym {
    get [Symbol.toStringTag](): string {
        return 'symbol';
    }
    /**
     * The typeof operator returns a string indicating the type of the unevaluated operand.
     */
    public get typeof(): string { return 'symbol' }

    /**
     * The isinstance() function returns True if the specified object is of the specified type, otherwise False.
     */
    public static isInstance( obj: any ): boolean { return obj instanceof Sym; }

    public value = bigInt(0);

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
    constructor ( sc?: string | Sym | SymbolCode | number | BigInteger, precision?: number ) {
        if ( isNull(sc) && isNull( precision )) {
            this.value = bigInt(0);
            return;
        }
        // Number
        else if ( typeof sc == "number" || typeof sc == "bigint" ) {
            this.value = bigInt(sc);
        }
        // BigInt
        else if ( bigInt.isInstance( sc ) ) {
            this.value = sc;
        }
        else if ( typeof sc == "string" ) {
            // "precision,symbol_code" (ex: "4,EOS")
            if ( sc.includes(",")) {
                const [ precision_str, symcode_str ] = sc.split(",");
                const precision = Number( precision_str );
                check( !isNaN(precision), "[precision] must be number type");
                check( !isNull(precision), "[precision] is required");
                check( !isNull(symcode_str), "[symcode] is required");

                const symcode = new SymbolCode(symcode_str).raw();
                this.value = bigInt(symcode).shiftLeft(8).or(Number( precision_str || "" ));
            // "symbol_code" + @param: precision
            } else {
                check( !isNaN( Number(precision) ), "[precision] must be number type");
                check( !isNull(precision), "[precision] is required");
                check( !isNull(sc), "[symcode] is required");

                const symcode = new SymbolCode(sc).raw();
                this.value = bigInt(symcode).shiftLeft(8).or(precision || 0);
            }
        }
        else if ( getType( sc ) == "symbol" ) {
            const sym: any = sc;
            this.value = sym.raw();
        } else if ( getType( sc ) == "symbol_code" ) {
            const symcode: any = sc;
            check( !isNull(precision), "[precision] is required");
            this.value = bigInt(symcode.raw()).shiftLeft(8).or(precision || 0);
        } else {
            check( false, "invalid symbol parameters");
        }
    }

    static from( sc?: string | Sym | SymbolCode | number | BigInteger, precision?: number ): Sym {
        return new Sym(sc, precision);
    }

    /**
     * Is this symbol valid
     */
    public is_valid(): boolean {
        return this.code().is_valid();
    }

    /**
     * This symbol's precision
     */
    public precision(): number {
        return Number(this.value.and("0x00000000000000FF"));
    }

    /**
     * Returns representation of symbol name
     */
    public code(): SymbolCode {
        return new SymbolCode(this.value.shiftRight(8) );
    }

    /**
     * Returns uint64_t repreresentation of the symbol
     */
    public raw(): BigInteger {
        return this.value;
    }

    /**
     * Explicit cast to bool of the symbol
     *
     * @return Returns true if the symbol is set to the default value of 0 else true.
     */
    public bool(): boolean {
        return this.value.notEquals(0);
    }

    // /**
    //  * %Print the symbol
    //  */
    // public print( show_precision = true ): void {
    //     if ( show_precision ) {
    //         process.stdout.write( String( this.precision() ) + "," );
    //     }
    //     process.stdout.write( this.code().to_string() );
    // }

    /**
     * The toString() method returns the string representation of the object.
     */
    public toString( show_precision = true ): string {
        return `${show_precision ? String( this.precision() ) + "," : ''}${this.code().to_string()}`
    }

    /**
     * Equivalency operator. Returns true if a == b (are the same)
     *
     * @return boolean - true if both provided symbol_codes are the same
     */
    public static isEqual( a: Sym, b: Sym ): boolean {
        return a.raw().equals( b.raw() );
    }

    public isEqual( a: Sym ): boolean {
        return a.raw().equals( this.raw() );
    }

    /**
     * Inverted equivalency operator. Returns true if a != b (are different)
     *
     * @return boolean - true if both provided symbol_codes are not the same
     */
    public static isNotEqual( a: Sym, b: Sym ): boolean {
        return a.raw().notEquals( b.raw() );
    }

    public isNotEqual( a: Sym ): boolean {
        return a.raw().notEquals( this.raw() );
    }

    /**
     * Less than operator. Returns true if a < b.
     * @brief Less than operator
     * @return boolean - true if symbol_code `a` is less than `b`
     */
    public static isLessThan( a: Sym, b: Sym ): boolean {
        return a.raw().lesser( b.raw() );
    }

    public isLessThan( a: Sym ): boolean {
        return this.raw().lesser( a.raw() );
    }
}

export const symbol: {
    /**
     * Symbol & String & Raw
     *
     * @example
     *
     * const sym = symbol("4,EOS")
     * symbol( sym )
     * symbol( 0 )
     */
    ( sym?: Sym | string | number | BigInteger ): Sym;

    /**
     * SymbolCode & Precision
     *
     * @example
     *
     * symbol( "EOS", 4 )
     */
    ( sc?: string | SymbolCode, precision?: number ): Sym;
} = ( obj1?: any, obj2?: any ) => {
    return new Sym( obj1, obj2 );
}
