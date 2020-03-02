import { isNull } from "..";

test("utils.isNull", () => {
  expect( isNull( undefined )).toBeTruthy();
  expect( isNull( null )).toBeTruthy();
  expect( isNull( "foo" )).toBeFalsy();
  expect( isNull( 0 )).toBeFalsy();
});

