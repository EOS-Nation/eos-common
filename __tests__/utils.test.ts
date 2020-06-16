import { number_to_asset, asset_to_number, asset_to_precision, symbol } from "../";
import bigInt from "big-integer";

test("utils", () => {
  const quantity1 = number_to_asset( 3.47475, symbol("SYS", 4));
  expect( quantity1.amount ).toStrictEqual( bigInt( 34747 ));
  expect( quantity1.symbol.precision() ).toBe( 4 );
  expect( asset_to_number( quantity1) ).toBe( 3.4747 );
  expect( Number(asset_to_precision( quantity1, 2 ).amount) ).toBe( 347 );
});
