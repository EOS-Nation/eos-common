import { Sym, symbol } from "./symbol";
import { check } from "./check";
import { write_decimal } from "./eosiolib";

function number_to_bigint( num: number ): bigint {
    return BigInt( num.toFixed(0) );
}

function isNull( value: any ): boolean {
    return value == undefined || value == null
}

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
    public typeof(): string { return 'asset' }

    /**
     * {constexpr int64_t} Maximum amount possible for this asset. It's capped to 2^62 - 1
     */
    public static max_amount = (BigInt(1) << BigInt(62)) - BigInt(1);

    /**
     * {int64_t} The amount of the asset
     */
    public amount = BigInt(0);

    /**
     * {symbol} The symbol name of the asset
     */
    public symbol: Sym = symbol();

    /**
     * Construct a new asset given the symbol name and the amount
     *
     * @param amount - The amount of the asset
     * @param sym - The name of the symbol
     */
    constructor ( amount?: string | number | bigint, sym?: Sym ) {
        if ( isNull(amount) && isNull(sym) ) {
            return;
        }
        else if ( typeof amount == "string") {
            const [amount_str, symbol_str] = amount.split(" ");
            const precision = (amount_str.split(".")[1] || []).length;
            this.amount = number_to_bigint( Number(amount_str) * Math.pow(10, precision));
            this.symbol = new Sym( symbol_str, precision );
        } else if ( sym ) {
            this.amount = (typeof amount == "number") ? number_to_bigint(amount) : BigInt(amount);
            this.symbol = sym;
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
        return -BigInt(Asset.max_amount) <= BigInt(this.amount) && this.amount <= Asset.max_amount;
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
    public set_amount( amount: bigint | number ): void {
        this.amount = BigInt(amount);
        check( this.is_amount_within_range(), "magnitude of asset amount must be less than 2^62" );
    }

    /**
     * Subtraction assignment operator
     *
     * @param a - Another asset to subtract this asset with
     * @return asset& - Reference to this asset
     * @post The amount of this asset is subtracted by the amount of asset a
     */
    public minus( a: Asset | number | bigint ): Asset {
        if ( typeof a == "number" || typeof a == "bigint") {
            this.amount -= BigInt( a );
        } else {
            check( a.symbol.isEqual( this.symbol ), "attempt to subtract asset with different symbol" );
            this.amount -= a.amount;
        }
        check( -Asset.max_amount <= this.amount, "subtraction underflow" );
        check( this.amount <= Asset.max_amount,  "subtraction overflow" );
        return this;
    }

    /**
     * Addition Assignment  operator
     *
     * @param a - Another asset to subtract this asset with
     * @return asset& - Reference to this asset
     * @post The amount of this asset is added with the amount of asset a
     */
    public plus( a: Asset | number | bigint ): Asset {
        if ( typeof a == "number" || typeof a == "bigint") {
            this.amount += BigInt( a );
        } else {
            check( a.symbol.isEqual( this.symbol ), "attempt to add asset with different symbol" );
            this.amount += a.amount;
        }
        check( -Asset.max_amount <= this.amount, "addition underflow" );
        check( this.amount <= Asset.max_amount,  "addition overflow" );
        return this;
    }

    /**
     * Addition operator
     *
     * @param a - The first asset to be added
     * @param b - The second asset to be added
     * @return asset - New asset as the result of addition
     */
    public static plus( a: Asset, b: Asset ): Asset {
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
    public static minus( a: Asset, b: Asset ): Asset {
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
    public times( a: number | bigint | Asset ): Asset {
        let amount: bigint;
        if ( typeof a == "number" || typeof a == "bigint") {
            amount = BigInt(a)
        } else {
            check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
            amount = a.amount;
        }
        const tmp = this.amount * amount;
        check( tmp <= Asset.max_amount, "multiplication overflow" );
        check( tmp >= -Asset.max_amount, "multiplication underflow" );
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
    public static times( a: Asset, b: number | bigint | Asset ): Asset {
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
    public div( a: number | bigint | Asset ): Asset {
        let amount: bigint;
        if ( typeof a == "number" || typeof a == "bigint") {
            amount = BigInt(a)
        } else {
            check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
            amount = a.amount;
        }
        check( amount != BigInt(0), "divide by zero" );
        check( !(this.amount == -Asset.max_amount && amount == BigInt(-1)), "signed division overflow" );
        this.amount /= amount;
        return this;
    }

    /**
     * Division operator, with a number proceeding
     *
     * @param a - The asset to be divided
     * @param b - The divisor for the asset's amount
     * @return asset - New asset as the result of division
     */
    public static div( a: Asset, b: number | bigint | Asset ): Asset {
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
        return a.amount == b.amount;
    }

    public isEqual( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return a.amount == this.amount;
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
        return !( a == b);
    }

    public isNotEqual( a: Asset ): boolean {
        return !( a == this );
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
        return a.amount < b.amount;
    }

    public isLessThan( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return this.amount < a.amount;
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
        return a.amount <= b.amount;
    }

    public isLessThanOrEqual( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return this.amount <= a.amount;
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
        return a.amount > b.amount;
    }

    public isGreaterThan( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return this.amount > a.amount;
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
        return a.amount >= b.amount;
    }

    public isGreaterThanOrEqual( a: Asset ): boolean {
        check( a.symbol.isEqual( this.symbol ), "comparison of assets with different symbols is not allowed" );
        return this.amount >= a.amount;
    }

    public to_string(): string {
        const amount = write_decimal(this.amount, this.symbol.precision(), true);
        const symcode = this.symbol.code().to_string();
        return `${amount} ${symcode}`;
    }

    /**
     * %Print the asset
     *
     * @brief %Print the asset
     */
    public print(): void {
        process.stdout.write(this.to_string());
    }
}

export function asset( amount?: string | number | bigint, sym?: Sym ): Asset {
    return new Asset( amount, sym );
}
