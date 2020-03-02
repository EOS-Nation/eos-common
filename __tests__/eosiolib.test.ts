import { write_decimal } from "..";

test("eosiolib.write_decimal", () => {
    expect( write_decimal( -4611686018427387903n, 0, true ) ).toBe( "-4611686018427387903" );
    expect( write_decimal( -4611686018427387903n, 2, true ) ).toBe( "-46116860184273879.03" );

    expect( write_decimal( -4611n, 4, true ) ).toBe( "-0.4611" );
    expect( write_decimal( 4611n, 4, true ) ).toBe( "0.4611" );

    expect( write_decimal( 14611n, 4, true ) ).toBe( "1.4611" );
    expect( write_decimal( -14611n, 4, true ) ).toBe( "-1.4611" );

    expect( write_decimal( -1n, 4, true ) ).toBe( "-0.0001" );
    expect( write_decimal( -0n, 4, true ) ).toBe( "0.0000" );
});
