## 2020-05-01

- add `extended_symbol.raw()`

## 2020-04-06

- support adding `asset` as param to `asset`

## 2020-03-07

- rename `Symbol` => `Sym` (conflict with native Symbol class)
- added `name` Class
- added `extended_symbol` Class

## 2020-03-06

- Add operators to `asset`
  - max_amount
  - plus
  - minus
  - times
  - div
  - isEqual
  - isNotEqual
  - isLessThan
  - isLessThanOrEqual
  - isGreaterThan
  - isGreaterThanOrEqual

## 2020-02-25
- add `symbol_code` unit tests from C++ tests
- add `symbol` method
- add `symbol_code` method
- fix 7 character symcode
- fully refactor `Symbol` to C++ represenation

## 2020-02-24

- `toNumber` => `to_double`
- `toString` => `to_string`
- remove `toDecimal`
- remove `decimal.js` dependency
- added rollup for browser bundling
