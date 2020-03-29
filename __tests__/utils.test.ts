import { number_to_asset, asset_to_number, symbol } from "../";
import bigInt from "big-integer";

test("utils", () => {
  const quantity1 = number_to_asset( 3.47475, symbol("SYS", 4));
  expect( quantity1.amount ).toStrictEqual( bigInt( 34747 ));
  expect( quantity1.symbol.precision() ).toBe( 4 );
  expect( asset_to_number( quantity1) ).toBe( 3.4747 );
});
