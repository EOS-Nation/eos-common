import { write_decimal } from "../dist";
import bigInt from "big-integer";

test("eosiolib.write_decimal", () => {
    expect( write_decimal( bigInt("-4611686018427387903"), 0, true ) ).toBe( "-4611686018427387903" );
    expect( write_decimal( bigInt("-4611686018427387903"), 2, true ) ).toBe( "-46116860184273879.03" );

    expect( write_decimal( bigInt("-4611"), 4, true ) ).toBe( "-0.4611" );
    expect( write_decimal( bigInt("4611"), 4, true ) ).toBe( "0.4611" );

    expect( write_decimal( bigInt("14611"), 4, true ) ).toBe( "1.4611" );
    expect( write_decimal( bigInt("-14611"), 4, true ) ).toBe( "-1.4611" );

    expect( write_decimal( bigInt("-1"), 4, true ) ).toBe( "-0.0001" );
    expect( write_decimal( bigInt("-0"), 4, true ) ).toBe( "0.0000" );
});
