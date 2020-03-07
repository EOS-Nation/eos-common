import { name, symbol, extended_symbol } from ".."

const u64min = 0n;
const u64max = 18446744073709551615n;

test("extended_symbol", () => {
    const n0 = name("1");
    const n1 = name("5");
    const n2 = name("a");
    const n3 = name("z");
    const n4 = name("111111111111j");
    const n5 = name("555555555555j");
    const n6 = name("aaaaaaaaaaaaj");
    const n7 = name("zzzzzzzzzzzzj");

    const s0 = symbol("A", 0);
    const s1 = symbol("Z", 0);
    const s2 = symbol("AAAAAAA", 255);
    const s3 = symbol("ZZZZZZZ", 255);

    //// constexpr extended_symbol()
    // constexpr name get_symbol()
    // constexpr name get_contract()
    expect( extended_symbol( ).get_symbol().raw() ).toBe( 0n )
    expect( extended_symbol( ).get_contract().value ).toBe( 0n )

    //// constexpr extended_symbol(symbol, name)
    expect( extended_symbol( s0, n0 ).get_symbol().raw()).toBe( 16640n )
    expect( extended_symbol( s0, n1 ).get_symbol().code().raw()).toBe( 65n )
    expect( extended_symbol( s1, n2 ).get_symbol().raw()).toBe( 23040n )
    expect( extended_symbol( s1, n3 ).get_symbol().code().raw()).toBe( 90n )
    expect( extended_symbol( s0, n0 ).get_contract().value).toBe( 576460752303423488n )
    expect( extended_symbol( s0, n1 ).get_contract().value).toBe( 2882303761517117440n )
    expect( extended_symbol( s1, n2 ).get_contract().value).toBe( 3458764513820540928n )
    expect( extended_symbol( s1, n3 ).get_contract().value).toBe( 17870283321406128128n )
    expect( extended_symbol( s2, n4 ).get_symbol().raw()).toBe( 4702111234474983935n )
    expect( extended_symbol( s2, n5 ).get_symbol().code().raw()).toBe( 18367622009667905n )
    expect( extended_symbol( s3, n6 ).get_symbol().raw()).toBe( 6510615555426900735n )
    expect( extended_symbol( s3, n7 ).get_symbol().code().raw()).toBe( 25432092013386330n )
    expect( extended_symbol( s2, n4 ).get_contract().value).toBe( 595056260442243615n )
    expect( extended_symbol( s2, n5 ).get_contract().value).toBe( 2975281302211218015n )
    expect( extended_symbol( s3, n6 ).get_contract().value).toBe( 3570337562653461615n )
    expect( extended_symbol( s3, n7 ).get_contract().value).toBe( u64max )

    // ---------------------
    // void print(bool)const
    // Note:
    // Uncomment once print checking has been resolved
    // CHECK_PRINT( "0,A@1", [&](){extended_symbol{s0, n0}.print(true);} );
    // CHECK_PRINT( "0,A@5", [&](){extended_symbol{s0, n1}.print(true);} );
    // CHECK_PRINT( "0,Z@a", [&](){extended_symbol{s1, n2}.print(true);} );
    // CHECK_PRINT( "0,Z@z", [&](){extended_symbol{s1, n3}.print(true);} );
    // CHECK_PRINT( "255,AAAAAAA@111111111111j", [&](){extended_symbol{s2, n4}.print(true);} );
    // CHECK_PRINT( "255,AAAAAAA@555555555555j", [&](){extended_symbol{s2, n5}.print(true);} );
    // CHECK_PRINT( "255,ZZZZZZZ@aaaaaaaaaaaaj", [&](){extended_symbol{s3, n6}.print(true);} );
    // CHECK_PRINT( "255,ZZZZZZZ@zzzzzzzzzzzzj", [&](){extended_symbol{s3, n7}.print(true);} );

    // extended_symbol( s0, n0).print(true)
    // extended_symbol( s0, n1).print(true)
    // extended_symbol( s1, n2).print(true)
    // extended_symbol( s1, n3).print(true)
    // extended_symbol( s2, n4).print(true)
    // extended_symbol( s2, n5).print(true)
    // extended_symbol( s3, n6).print(true)
    // extended_symbol( s3, n7).print(true)

    // -------------------------------------------------------------------------------
    // friend constexpr bool operator==(const extended_symbol&, const extended_symbol&)
    expect( extended_symbol(s0, n0).isEqual( extended_symbol(s0, n0))).toBeTruthy()
    expect( extended_symbol(s1, n3).isEqual( extended_symbol(s1, n3))).toBeTruthy()
    expect( extended_symbol(s2, n4).isEqual( extended_symbol(s2, n4))).toBeTruthy()
    expect( extended_symbol(s3, n7).isEqual( extended_symbol(s3, n7))).toBeTruthy()

    // -------------------------------------------------------------------------------
    // friend constexpr bool operator!=(const extended_symbol&, const extended_symbol&)
    expect( extended_symbol().isNotEqual( extended_symbol( s0, null ))).toBeTruthy()
    expect( extended_symbol(s0, null).isNotEqual( extended_symbol( s1, null ))).toBeTruthy()
    expect( extended_symbol(s1, null).isNotEqual( extended_symbol( s2, null ))).toBeTruthy()
    expect( extended_symbol(s2, null).isNotEqual( extended_symbol( s3, null ))).toBeTruthy()

    // -------------------------------------------------------------------------------
    // friend constexpr bool operator<(const extended_symbol&, const extended_symbol&)
    expect( extended_symbol().isLessThan( extended_symbol( s0, null ))).toBeTruthy()
    expect( extended_symbol().isLessThan( extended_symbol( s1, null ))).toBeTruthy()
    expect( extended_symbol().isLessThan( extended_symbol( s2, null ))).toBeTruthy()
    expect( extended_symbol().isLessThan( extended_symbol( s3, null ))).toBeTruthy()

})