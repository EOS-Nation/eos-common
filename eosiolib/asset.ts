import { Sym, symbol } from "./symbol";
import { check } from "./check";
import { write_decimal } from "./eosiolib";
import { getSymbol, getAmount, isNull, number_to_bigint, getType } from "./utils";
import bigInt, { BigInteger } from "big-integer";

/**
 * Asset
 *
 * @name Asset
 * @param {number} amount The amount of the asset
 * @param {Symbol} sym  The name of the symbol
 * @returns {Asset} Asset
 * @example
 *
 * const quantity = new Asset(10000, new Symbol("EOS", 4));
 * quantity.toString() //=> "1.0000 EOS";
 * quantity.symbol.code() //=> "EOS"
 * quantity.symbol.precision //=> 4
 */
export class Asset {
    get [Symbol.toStringTag](): string {
        return 'asset';
    }
    /**
     * The typeof operator returns a string indicating the type of the unevaluated operand.
     */
    public get typeof(): string { return 'asset' }

    /**
     * The isinstance() function returns True if the specified object is of the specified type, otherwise False.
     */
    public static isInstance( obj: any ): boolean { return obj instanceof Asset; }

    /**
     * {constexpr int64_t} Maximum amount possible for this asset. It's capped to 2^62 - 1
     */
    public static max_amount = (bigInt(1).shiftLeft(62)).minus(1);

    /**
     * {int64_t} The amount of the asset
     */
    public amount = bigInt(0);

    /**
     * {symbol} The symbol name of the asset
     */
    public symbol: Sym = symbol();

    /**
     * Construct a new asset given the symbol name and the amount
     */
    constructor ( obj1?: string | number | BigInteger | bigint | Asset, obj2?: Sym ) {
        if ( isNull(obj1) && isNull(obj2) ) {
            return;
        }
        if ( typeof obj1 == "string" ) {
            const [amount_str, symbol_str] = obj1.split(" ");
            const precision = (amount_str.split(".")[1] || []).length;
            this.amount = number_to_bigint( Number( amount_str ) * Math.pow(10, precision));
            this.symbol = new Sym( symbol_str, precision );
        } else if ( getType( obj1 ) == "asset") {
            const _sym = getSymbol( obj1 );
            if ( !_sym ) throw new Error("[sym] is required");

            this.amount = getAmount( obj1 );
            this.symbol = _sym;
        } else if ( obj2 ) {
            this.amount = getAmount( obj1 );
            this.symbol = obj2;
        } else {
            throw new Error("[sym] is required");
        }

        check( this.is_amount_within_range(), "magnitude of asset amount must be less than 2^62" );
        check( this.symbol.is_valid(), "invalid symbol name" );
    }

    /**
     * Check if the amount doesn't exceed the max amount
     *
     * @return true - if the amount doesn't exceed the max amount
     * @return false - otherwise
     */
    public is_amount_within_range(): boolean {
        return (Asset.max_amount.multiply(-1)).lesserOrEquals(this.amount) && this.amount.lesserOrEquals(Asset.max_amount);
    }

    /**
     * Check if the asset is valid. %A valid asset has its amount <= max_amount and its symbol name valid
     *
     * @return true - if the asset is valid
     * @return false - otherwise
     */
    public is_valid(): boolean {
        return this.is_amount_within_range() && this.symbol.is_valid();
    }

    /**
     * Set the amount of the asset
     *
     * @param a - New amount for the asset
     */
    public set_amount( amount: BigInteger | number ): void {
        this.amount = typeof amount == "number" ? bigInt(amount) : amount;
        check( this.is_amount_within_range(), "magnitude of asset amount must be less than 2^62" );
    }

    /**
     * Subtraction assignment operator
     *
     * @param a - Another asset to subtract this asset with
     * @return asset& - Reference to this asset
     * @post The amount of this asset is subtracted by the amount of asset a
     */
    public minus( a: Asset | number | bigint | BigInteger ): Asset {
        const amount = getAmount( a );
        const sym = getSymbol( a );
        if ( sym ) check( sym.isEqual( this.symbol ), "attempt to subtract asset with different symbol" );

        this.amount = this.amount.minus( amount );
        check( Asset.max_amount.multiply(-1).lesserOrEquals(this.amount), "subtraction underflow" );
        check( this.amount.lesserOrEquals(Asset.max_amount),  "subtraction overflow" );
        return this;
    }

    /**
     * Addition Assignment  operator
     *
     * @param a - Another asset to subtract this asset with
     * @return asset& - Reference to this asset
     * @post The amount of this asset is added with the amount of asset a
     */
    public plus( a: Asset | number | bigint | BigInteger ): Asset {
        const amount = getAmount( a );
        const sym = getSymbol( a );
        if ( sym ) check( sym.isEqual( this.symbol ), "attempt to add asset with different symbol" );

        this.amount = this.amount.plus( amount );
        check( Asset.max_amount.multiply(-1).lesserOrEquals(this.amount), "addition underflow" );
        check( this.amount.lesserOrEquals( Asset.max_amount ),  "addition overflow" );
        return this;
    }

    /**
     * Addition operator
     *
     * @param a - The first asset to be added
     * @param b - The second asset to be added
     * @return asset - New asset as the result of addition
     */
    public static plus( a: Asset, b: Asset | number | bigint | BigInteger ): Asset {
        const result = new Asset(a.amount, a.symbol);
        result.plus( b );
        return result;
    }

    /**
     * Subtraction operator
     *
     * @param a - The asset to be subtracted
     * @param b - The asset used to subtract
     * @return asset - New asset as the result of subtraction of a with b
     */
    public static minus( a: Asset, b: Asset | number | bigint | BigInteger ): Asset {
        const result = new Asset(a.amount, a.symbol);
        result.minus( b );
        return result;
    }

    /**
     * Multiplication assignment operator, with a number
     *
     * @details Multiplication assignment operator. Multiply the amount of this asset with a number and then assign the value to itself.
     * @param a - The multiplier for the asset's amount
     * @return asset - Reference to this asset
     * @post The amount of this asset is multiplied by a
     */
    public times( a: Asset | number | bigint | BigInteger ): Asset {
        const amount = getAmount( a );
        const sym = getSymbol( a );
        if ( sym ) check( sym.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );

        const tmp = this.amount.multiply(amount);
        check( tmp.lesserOrEquals( Asset.max_amount), "multiplication overflow" );
        check( tmp.greaterOrEquals(Asset.max_amount.multiply(-1)), "multiplication underflow" );
        this.amount = tmp;
        return this;
    }

    /**
     * Multiplication operator, with a number proceeding
     *
     * @brief Multiplication operator, with a number proceeding
     * @param a - The asset to be multiplied
     * @param b - The multiplier for the asset's amount
     * @return asset - New asset as the result of multiplication
     */
    public static times( a: Asset, b: Asset | number | bigint | BigInteger ): Asset {
        const result = new Asset(a.amount, a.symbol);
        result.times(b);
        return result;
    }

    /**
     * @brief Division assignment operator, with a number
     *
     * @details Division assignment operator. Divide the amount of this asset with a number and then assign the value to itself.
     * @param a - The divisor for the asset's amount
     * @return asset - Reference to this asset
     * @post The amount of this asset is divided by a
     */
    public div( a: Asset | number | bigint | BigInteger ): Asset {
        const amount = getAmount( a );
        const sym = getSymbol( a );
        if ( sym ) check( sym.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );

        check( amount.notEquals(0), "divide by zero" );
        check( !(this.amount.equals(Asset.max_amount.multiply(-1)) && amount.equals(-1)), "signed division overflow" );
        this.amount = this.amount.divide(amount);
        return this;
    }

    /**
     * Division operator, with a number proceeding
     *
     * @param a - The asset to be divided
     * @param b - The divisor for the asset's amount
     * @return asset - New asset as the result of division
     */
    public static div( a: Asset, b: Asset | number | bigint | BigInteger ): Asset {
        const result = new Asset( a.amount, a.symbol );
        result.div(b);
        return result;
    }

    /**
     * Equality operator
     *
     * @param a - The first asset to be compared
     * @param b - The second asset to be compared
     * @return true - if both asset has the same amount
     * @return false - otherwise
     * @pre Both asset must have the same symbol
     */
    public static isEqual( a: Asset, b: Asset ): boolean {
        check( a.symbol.isEqual( b.symbol ), "comparison of assets with different symbols is not allowed" );
        return a.amount.equals( b.amount );
    }

    public isEqual( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return a.amount.equals( this.amount );
    }

    /**
     * Inequality operator
     *
     * @param a - The first asset to be compared
     * @param b - The second asset to be compared
     * @return true - if both asset doesn't have the same amount
     * @return false - otherwise
     * @pre Both asset must have the same symbol
     */
    public static isNotEqual( a: Asset, b: Asset ): boolean {
        return !( a.isEqual(b));
    }

    public isNotEqual( a: Asset ): boolean {
        return !( a.isEqual(this) );
    }

    /**
     * Less than operator
     *
     * @param a - The first asset to be compared
     * @param b - The second asset to be compared
     * @return true - if the first asset's amount is less than the second asset amount
     * @return false - otherwise
     * @pre Both asset must have the same symbol
     */
    public static isLessThan( a: Asset, b: Asset ): boolean {
        check( a.symbol.isEqual( b.symbol ), "comparison of assets with different symbols is not allowed" );
        return a.amount.lesser(b.amount);
    }

    public isLessThan( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return this.amount.lesser(a.amount);
    }

    /**
     * Less or equal to operator
     *
     * @param a - The first asset to be compared
     * @param b - The second asset to be compared
     * @return true - if the first asset's amount is less or equal to the second asset amount
     * @return false - otherwise
     * @pre Both asset must have the same symbol
     */
    public static isLessThanOrEqual( a: Asset, b: Asset ): boolean {
        check( a.symbol.isEqual( b.symbol ), "comparison of assets with different symbols is not allowed" );
        return a.amount.lesserOrEquals(b.amount);
    }

    public isLessThanOrEqual( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return this.amount.lesserOrEquals(a.amount);
    }

    /**
     * Greater than operator
     *
     * @param a - The first asset to be compared
     * @param b - The second asset to be compared
     * @return true - if the first asset's amount is greater than the second asset amount
     * @return false - otherwise
     * @pre Both asset must have the same symbol
     */
    public static isGreaterThan( a: Asset, b: Asset ): boolean {
        check( a.symbol.isEqual( b.symbol ), "comparison of assets with different symbols is not allowed" );
        return a.amount.greater( b.amount );
    }

    public isGreaterThan( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return this.amount.greater( a.amount );
    }

    /**
     * Greater or equal to operator
     *
     * @param a - The first asset to be compared
     * @param b - The second asset to be compared
     * @return true - if the first asset's amount is greater or equal to the second asset amount
     * @return false - otherwise
     * @pre Both asset must have the same symbol
     */
    public static isGreaterThanOrEqual( a: Asset, b: Asset ): boolean {
        check( a.symbol.isEqual( b.symbol ), "comparison of assets with different symbols is not allowed" );
        return a.amount.greaterOrEquals( b.amount );
    }

    public isGreaterThanOrEqual( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return this.amount.greaterOrEquals( a.amount );
    }

    /**
     * The toString() method returns the string representation of the object.
     */
    public toString(): string {
        return this.to_string();
    }

    public to_string(): string {
        const amount = write_decimal(this.amount, this.symbol.precision(), true);
        const symcode = this.symbol.code().to_string();
        return `${amount} ${symcode}`;
    }

    // /**
    //  * %Print the asset
    //  *
    //  * @brief %Print the asset
    //  */
    // public print(): void {
    //     process.stdout.write(this.to_string());
    // }
}

export const asset: {
    /**
     * String
     *
     * @example
     *
     * asset("1.0000 EOS")
     */
    ( asset?: string ): Asset;

    /**
     * Asset
     *
     * @example
     *
     * asset( asset("1.0000 EOS") )
     */
    ( asset?: Asset ): Asset;

    /**
     * Amount & Sym
     *
     * @example
     *
     * asset( 10000, symbol("4,EOS") )
     */
    ( amount?: number | bigint | BigInteger, sym?: Sym ): Asset;
} = ( obj1?: any, obj2?: any ) => {
    return new Asset( obj1, obj2 );
}
