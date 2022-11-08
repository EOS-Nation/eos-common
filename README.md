# `eos-common`

[![Build Status](https://github.com/EOS-Nation/eos-common/eos-common/actions/workflows/test.yml/badge.svg)](https://github.com/EOS-Nation/eos-common/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/eos-common.svg)](https://badge.fury.io/js/eos-common)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/EOS-Nation/eos-common/master/LICENSE)

> EOSIO Smart Contract common library used for Typescript

Implements most commonly used EOSIO C++ Classes into Typescript:

-   [asset](https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/core/eosio/asset.hpp)
-   [symbol](https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/core/eosio/symbol.hpp)
-   [symbol_code](https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/core/eosio/symbol.hpp)
-   [name](https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/core/eosio/name.hpp)
-   [extended_asset](https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/core/eosio/asset.hpp)
-   [extended_symbol](https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/core/eosio/symbol.hpp)

## Installation

Using Yarn:

```bash
yarn add eos-common
```

or using NPM:

```bash
npm install --save eos-common
```

## Quick Start

```ts
import { asset, symbol } from "eos-common"

const quantity = asset("1.0000 EOS");
// or
const quantity = asset(10000, symbol("EOS", 4));
quantity.to_string() //=> "1.0000 EOS";
quantity.symbol.code().to_string() //=> "EOS"
quantity.symbol.precision() //=> 4
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [Asset](#asset)
    -   [Parameters](#parameters)
    -   [Examples](#examples)
    -   [amount](#amount)
    -   [symbol](#symbol)
    -   [typeof](#typeof)
    -   [is_amount_within_range](#is_amount_within_range)
    -   [is_valid](#is_valid)
    -   [set_amount](#set_amount)
        -   [Parameters](#parameters-1)
    -   [minus](#minus)
        -   [Parameters](#parameters-2)
    -   [plus](#plus)
        -   [Parameters](#parameters-3)
    -   [times](#times)
        -   [Parameters](#parameters-4)
    -   [div](#div)
        -   [Parameters](#parameters-5)
    -   [toString](#tostring)
    -   [isInstance](#isinstance)
        -   [Parameters](#parameters-6)
    -   [plus](#plus-1)
        -   [Parameters](#parameters-7)
    -   [minus](#minus-1)
        -   [Parameters](#parameters-8)
    -   [times](#times-1)
        -   [Parameters](#parameters-9)
    -   [div](#div-1)
        -   [Parameters](#parameters-10)
    -   [isEqual](#isequal)
        -   [Parameters](#parameters-11)
    -   [isNotEqual](#isnotequal)
        -   [Parameters](#parameters-12)
    -   [isLessThan](#islessthan)
        -   [Parameters](#parameters-13)
    -   [isLessThanOrEqual](#islessthanorequal)
        -   [Parameters](#parameters-14)
    -   [isGreaterThan](#isgreaterthan)
        -   [Parameters](#parameters-15)
    -   [isGreaterThanOrEqual](#isgreaterthanorequal)
        -   [Parameters](#parameters-16)
    -   [max_amount](#max_amount)
-   [check](#check)
    -   [Parameters](#parameters-17)
    -   [Examples](#examples-1)
-   [write_decimal](#write_decimal)
    -   [Parameters](#parameters-18)
-   [ExtendedAsset](#extendedasset)
    -   [Parameters](#parameters-19)
    -   [quantity](#quantity)
    -   [contract](#contract)
    -   [typeof](#typeof-1)
    -   [get_extended_symbol](#get_extended_symbol)
    -   [toString](#tostring-1)
    -   [toJSON](#tojson)
    -   [times](#times-2)
        -   [Parameters](#parameters-20)
    -   [div](#div-2)
        -   [Parameters](#parameters-21)
    -   [minus](#minus-2)
        -   [Parameters](#parameters-22)
    -   [plus](#plus-2)
        -   [Parameters](#parameters-23)
    -   [isLessThan](#islessthan-1)
        -   [Parameters](#parameters-24)
    -   [isEqual](#isequal-1)
        -   [Parameters](#parameters-25)
    -   [isNotEqual](#isnotequal-1)
        -   [Parameters](#parameters-26)
    -   [isLessThanOrEqual](#islessthanorequal-1)
        -   [Parameters](#parameters-27)
    -   [isGreaterThanOrEqual](#isgreaterthanorequal-1)
        -   [Parameters](#parameters-28)
    -   [isInstance](#isinstance-1)
        -   [Parameters](#parameters-29)
-   [extended_asset](#extended_asset)
    -   [Parameters](#parameters-30)
    -   [Examples](#examples-2)
-   [ExtendedSymbol](#extendedsymbol)
    -   [Parameters](#parameters-31)
    -   [typeof](#typeof-2)
    -   [get_symbol](#get_symbol)
    -   [get_contract](#get_contract)
    -   [toString](#tostring-2)
        -   [Parameters](#parameters-32)
    -   [toJSON](#tojson-1)
        -   [Parameters](#parameters-33)
    -   [raw](#raw)
    -   [isInstance](#isinstance-2)
        -   [Parameters](#parameters-34)
    -   [isEqual](#isequal-2)
        -   [Parameters](#parameters-35)
    -   [isNotEqual](#isnotequal-2)
        -   [Parameters](#parameters-36)
    -   [isLessThan](#islessthan-2)
        -   [Parameters](#parameters-37)
-   [extended_symbol](#extended_symbol)
    -   [Parameters](#parameters-38)
    -   [Examples](#examples-3)
-   [Name](#name)
    -   [Parameters](#parameters-39)
    -   [typeof](#typeof-3)
    -   [length](#length)
    -   [suffix](#suffix)
    -   [raw](#raw-1)
    -   [bool](#bool)
    -   [toString](#tostring-3)
    -   [isInstance](#isinstance-3)
        -   [Parameters](#parameters-40)
    -   [char_to_value](#char_to_value)
        -   [Parameters](#parameters-41)
    -   [isEqual](#isequal-3)
        -   [Parameters](#parameters-42)
    -   [isNotEqual](#isnotequal-3)
        -   [Parameters](#parameters-43)
    -   [isLessThan](#islessthan-3)
        -   [Parameters](#parameters-44)
-   [SymbolCode](#symbolcode)
    -   [Parameters](#parameters-45)
    -   [typeof](#typeof-4)
    -   [toString](#tostring-4)
    -   [isEqual](#isequal-4)
        -   [Parameters](#parameters-46)
    -   [isNotEqual](#isnotequal-4)
        -   [Parameters](#parameters-47)
    -   [isLessThan](#islessthan-4)
        -   [Parameters](#parameters-48)
    -   [isInstance](#isinstance-4)
        -   [Parameters](#parameters-49)
-   [Symbol](#symbol-1)
    -   [Parameters](#parameters-50)
    -   [Examples](#examples-4)
-   [typeof](#typeof-5)
-   [is_valid](#is_valid-1)
-   [precision](#precision)
-   [code](#code)
-   [raw](#raw-2)
-   [bool](#bool-1)
-   [toString](#tostring-5)
    -   [Parameters](#parameters-51)
-   [isInstance](#isinstance-5)
    -   [Parameters](#parameters-52)
-   [isEqual](#isequal-5)
    -   [Parameters](#parameters-53)
-   [isNotEqual](#isnotequal-5)
    -   [Parameters](#parameters-54)
-   [isLessThan](#islessthan-5)
    -   [Parameters](#parameters-55)
-   [voteWeightToday](#voteweighttoday)
-   [stake2vote](#stake2vote)
    -   [Parameters](#parameters-56)
-   [vote2stake](#vote2stake)
    -   [Parameters](#parameters-57)
-   [calculate_producer_per_vote_pay](#calculate_producer_per_vote_pay)
    -   [Parameters](#parameters-58)

### Asset

Asset

#### Parameters

-   `amount` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The amount of the asset
-   `sym` **[Symbol](#symbol)** The name of the symbol

#### Examples

```javascript
const quantity = new Asset(10000, new Symbol("EOS", 4));
quantity.toString() //=> "1.0000 EOS";
quantity.symbol.code() //=> "EOS"
quantity.symbol.precision //=> 4
```

Returns **[Asset](#asset)** Asset

#### amount

{int64_t} The amount of the asset

#### symbol

{symbol} The symbol name of the asset

#### typeof

The typeof operator returns a string indicating the type of the unevaluated operand.

#### is_amount_within_range

Check if the amount doesn't exceed the max amount

Returns **any** true - if the amount doesn't exceed the max amount

Returns **any** false - otherwise

#### is_valid

Check if the asset is valid. %A valid asset has its amount &lt;= max_amount and its symbol name valid

Returns **any** true - if the asset is valid

Returns **any** false - otherwise

#### set_amount

Set the amount of the asset

##### Parameters

-   `amount`  
-   `a`  New amount for the asset

#### minus

Subtraction assignment operator

##### Parameters

-   `a`  Another asset to subtract this asset with

Returns **any** asset& - Reference to this asset

#### plus

Addition Assignment  operator

##### Parameters

-   `a`  Another asset to subtract this asset with

Returns **any** asset& - Reference to this asset

#### times

Multiplication assignment operator, with a number

##### Parameters

-   `a`  The multiplier for the asset's amount

Returns **any** asset - Reference to this asset

#### div

##### Parameters

-   `a`  The divisor for the asset's amount

Returns **any** asset - Reference to this asset

#### toString

The toString() method returns the string representation of the object.

#### isInstance

The isinstance() function returns True if the specified object is of the specified type, otherwise False.

##### Parameters

-   `obj`  

#### plus

Addition operator

##### Parameters

-   `a`  The first asset to be added
-   `b`  The second asset to be added

Returns **any** asset - New asset as the result of addition

#### minus

Subtraction operator

##### Parameters

-   `a`  The asset to be subtracted
-   `b`  The asset used to subtract

Returns **any** asset - New asset as the result of subtraction of a with b

#### times

Multiplication operator, with a number proceeding

##### Parameters

-   `a`  The asset to be multiplied
-   `b`  The multiplier for the asset's amount

Returns **any** asset - New asset as the result of multiplication

#### div

Division operator, with a number proceeding

##### Parameters

-   `a`  The asset to be divided
-   `b`  The divisor for the asset's amount

Returns **any** asset - New asset as the result of division

#### isEqual

Equality operator

##### Parameters

-   `a`  The first asset to be compared
-   `b`  The second asset to be compared

Returns **any** true - if both asset has the same amount

Returns **any** false - otherwise

#### isNotEqual

Inequality operator

##### Parameters

-   `a`  The first asset to be compared
-   `b`  The second asset to be compared

Returns **any** true - if both asset doesn't have the same amount

Returns **any** false - otherwise

#### isLessThan

Less than operator

##### Parameters

-   `a`  The first asset to be compared
-   `b`  The second asset to be compared

Returns **any** true - if the first asset's amount is less than the second asset amount

Returns **any** false - otherwise

#### isLessThanOrEqual

Less or equal to operator

##### Parameters

-   `a`  The first asset to be compared
-   `b`  The second asset to be compared

Returns **any** true - if the first asset's amount is less or equal to the second asset amount

Returns **any** false - otherwise

#### isGreaterThan

Greater than operator

##### Parameters

-   `a`  The first asset to be compared
-   `b`  The second asset to be compared

Returns **any** true - if the first asset's amount is greater than the second asset amount

Returns **any** false - otherwise

#### isGreaterThanOrEqual

Greater or equal to operator

##### Parameters

-   `a`  The first asset to be compared
-   `b`  The second asset to be compared

Returns **any** true - if the first asset's amount is greater or equal to the second asset amount

Returns **any** false - otherwise

#### max_amount

{constexpr int64_t} Maximum amount possible for this asset. It's capped to 2^62 - 1

### check

Assert if the predicate fails and use the supplied message.

#### Parameters

-   `pred` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Pre-condition
-   `msg` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Error Message

#### Examples

```javascript
check(a == b, "a does not equal b");
```

Returns **void** 

### write_decimal

Writes a number as a string

#### Parameters

-   `number`  The number to print before shifting the decimal point to the left by num_decimal_places.
-   `num_decimal_places`  The number of decimal places to shift the decimal point.
-   `negative`  Whether to print a minus sign in the front.

### ExtendedAsset

#### Parameters

-   `obj1`  
-   `obj2`  

#### quantity

The asset

#### contract

The owner of the asset

#### typeof

The typeof operator returns a string indicating the type of the unevaluated operand.

#### get_extended_symbol

Get the extended symbol of the asset

Returns **any** extended_symbol - The extended symbol of the asset

#### toString

The toString() method returns the string representation of the object.

#### toJSON

The toJSON() method returns the JSON representation of the object.

#### times

Multiplication assignment operator

##### Parameters

-   `a`  

#### div

Division operator

##### Parameters

-   `a`  

#### minus

Subtraction operator

##### Parameters

-   `a`  

#### plus

Addition operator

##### Parameters

-   `a`  

#### isLessThan

Less than operator

##### Parameters

-   `a`  

#### isEqual

Comparison operator

##### Parameters

-   `a`  

#### isNotEqual

Comparison operator

##### Parameters

-   `a`  

#### isLessThanOrEqual

Comparison operator

##### Parameters

-   `a`  

#### isGreaterThanOrEqual

Comparison operator

##### Parameters

-   `a`  

#### isInstance

The isinstance() function returns True if the specified object is of the specified type, otherwise False.

##### Parameters

-   `obj`  

### extended_asset

Extended Asset

#### Parameters

-   `obj1`  
-   `obj2`  

#### Examples

```javascript
extended_asset( asset("1.0000 EOS"), name("eosio.token"))
```

### ExtendedSymbol

#### Parameters

-   `obj1`  
-   `obj2`  

#### typeof

The typeof operator returns a string indicating the type of the unevaluated operand.

#### get_symbol

Returns the symbol in the extended_contract

Returns **any** symbol

#### get_contract

Returns the name of the contract in the extended_symbol

Returns **any** name

#### toString

The toString() method returns the string representation of the object.

##### Parameters

-   `show_precision`   (optional, default `true`)

#### toJSON

The toJSON() method returns the JSON representation of the object.

##### Parameters

-   `show_precision`   (optional, default `true`)

#### raw

Returns uint128_t repreresentation of the extended symbol

#### isInstance

The isinstance() function returns True if the specified object is of the specified type, otherwise False.

##### Parameters

-   `obj`  

#### isEqual

Equivalency operator. Returns true if a == b (are the same)

##### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if both provided name are the same

#### isNotEqual

Inverted equivalency operator. Returns true if a != b (are different)

##### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if both provided name are not the same

#### isLessThan

Less than operator. Returns true if a &lt; b.

##### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if name `a` is less than `b`

### extended_symbol

Extended Symbol

#### Parameters

-   `obj1`  
-   `obj2`  

#### Examples

```javascript
extended_symbol( symbol("4,EOS"), name("eosio.token") )
```

### Name

#### Parameters

-   `str`  

#### typeof

The typeof operator returns a string indicating the type of the unevaluated operand.

#### length

Returns the length of the %name

#### suffix

Returns the suffix of the %name

#### raw

Returns uint64_t repreresentation of the name

#### bool

Explicit cast to bool of the name

Returns **any** Returns true if the name is set to the default value of 0 else true.

#### toString

The toString() method returns the string representation of the object.

#### isInstance

The isinstance() function returns True if the specified object is of the specified type, otherwise False.

##### Parameters

-   `obj`  

#### char_to_value

Converts a %name Base32 symbol into its corresponding value

##### Parameters

-   `c`  Character to be converted

Returns **any** constexpr char - Converted value

#### isEqual

Equivalency operator. Returns true if a == b (are the same)

##### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if both provided name are the same

#### isNotEqual

Inverted equivalency operator. Returns true if a != b (are different)

##### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if both provided name are not the same

#### isLessThan

Less than operator. Returns true if a &lt; b.

##### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if name `a` is less than `b`

### SymbolCode

#### Parameters

-   `obj`  

#### typeof

The typeof operator returns a string indicating the type of the unevaluated operand.

#### toString

The toString() method returns the string representation of the object.

#### isEqual

Equivalency operator. Returns true if a == b (are the same)

##### Parameters

-   `comparison`  

Returns **any** boolean - true if both provided symbol_codes are the same

#### isNotEqual

Inverted equivalency operator. Returns true if a != b (are different)

##### Parameters

-   `comparison`  

Returns **any** boolean - true if both provided symbol_codes are not the same

#### isLessThan

Less than operator. Returns true if a &lt; b.

##### Parameters

-   `comparison`  

Returns **any** boolean - true if symbol_code `a` is less than `b`

#### isInstance

The isinstance() function returns True if the specified object is of the specified type, otherwise False.

##### Parameters

-   `obj`  

### Symbol

Symbol

#### Parameters

-   `code` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Symbol Code
-   `precision` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Precision

#### Examples

```javascript
const sym = new Symbol("EOS", 4);
sym.code() //=> "EOS"
sym.precision //=> 4
```

Returns **[Symbol](#symbol)** Symbol

### typeof

The typeof operator returns a string indicating the type of the unevaluated operand.

### is_valid

Is this symbol valid

### precision

This symbol's precision

### code

Returns representation of symbol name

### raw

Returns uint64_t repreresentation of the symbol

### bool

Explicit cast to bool of the symbol

Returns **any** Returns true if the symbol is set to the default value of 0 else true.

### toString

The toString() method returns the string representation of the object.

#### Parameters

-   `show_precision`   (optional, default `true`)

### isInstance

The isinstance() function returns True if the specified object is of the specified type, otherwise False.

#### Parameters

-   `obj`  

### isEqual

Equivalency operator. Returns true if a == b (are the same)

#### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if both provided symbol_codes are the same

### isNotEqual

Inverted equivalency operator. Returns true if a != b (are different)

#### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if both provided symbol_codes are not the same

### isLessThan

Less than operator. Returns true if a &lt; b.

#### Parameters

-   `a`  
-   `b`  

Returns **any** boolean - true if symbol_code `a` is less than `b`

### voteWeightToday

voteWeightToday computes the stake2vote weight for EOS, in order to compute the decaying value.

### stake2vote

Convert EOS stake into decaying value

#### Parameters

-   `staked`  
-   `vote` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** vote

### vote2stake

Convert vote decay value into EOS stake

#### Parameters

-   `vote`  
-   `staked` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** staked

### calculate_producer_per_vote_pay

Calculate producer vpay

#### Parameters

-   `total_votes`  
-   `pervote_bucket`  
-   `total_producer_vote_weight`  

Returns **bigint** producer pay as int64t
