import { name, symbol, extended_symbol, ExtendedSymbol } from ".."
import bigInt from "big-integer";

// const u64min = 0n;
const u64max = bigInt("18446744073709551615");

test("extended_symbol::from", () => {
    const ext_sym = ExtendedSymbol.from({contract: "eosio.token", sym: "4,EOS"});
    expect( Number(ext_sym.get_symbol().precision()) ).toBe(4);
    expect( ext_sym.get_symbol().code().toString() ).toBe("EOS");
    expect( ext_sym.get_contract().toString() ).toBe("eosio.token");
});

test("extended_symbol::extra", () => {
    const n = name("eosio.token");
    const s = symbol("EOS", 4);

    expect( extended_symbol( s, n ).raw() ).toEqual( bigInt("113238356228710427736761282112575983429") )
});

test("extended_symbol::json", () => {
    const ext_sym = extended_symbol({contract: "eosio.token", sym: "4,EOS"});
    const { contract, sym } = ext_sym.toJSON();

    expect( contract ).toStrictEqual("eosio.token");
    expect( sym ).toStrictEqual("4,EOS");
});

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
    expect( extended_symbol( ).get_symbol().raw() ).toStrictEqual( bigInt("0") )
    expect( extended_symbol( ).get_contract().value ).toStrictEqual( bigInt("0") )

    //// constexpr extended_symbol(symbol, name)
    expect( extended_symbol( s0, n0 ).get_symbol().raw()).toStrictEqual( bigInt("16640") )
    expect( extended_symbol( s0, n1 ).get_symbol().code().raw()).toStrictEqual( bigInt("65") )
    expect( extended_symbol( s1, n2 ).get_symbol().raw()).toStrictEqual( bigInt("23040") )
    expect( extended_symbol( s1, n3 ).get_symbol().code().raw()).toStrictEqual( bigInt("90") )
    expect( extended_symbol( s0, n0 ).get_contract().value).toStrictEqual( bigInt("576460752303423488") )
    expect( extended_symbol( s0, n1 ).get_contract().value).toStrictEqual( bigInt("2882303761517117440") )
    expect( extended_symbol( s1, n2 ).get_contract().value).toStrictEqual( bigInt("3458764513820540928") )
    expect( extended_symbol( s1, n3 ).get_contract().value).toStrictEqual( bigInt("17870283321406128128") )
    expect( extended_symbol( s2, n4 ).get_symbol().raw()).toStrictEqual( bigInt("4702111234474983935") )
    expect( extended_symbol( s2, n5 ).get_symbol().code().raw()).toStrictEqual( bigInt("18367622009667905") )
    expect( extended_symbol( s3, n6 ).get_symbol().raw()).toStrictEqual( bigInt("6510615555426900735") )
    expect( extended_symbol( s3, n7 ).get_symbol().code().raw()).toStrictEqual( bigInt("25432092013386330") )
    expect( extended_symbol( s2, n4 ).get_contract().value).toStrictEqual( bigInt("595056260442243615") )
    expect( extended_symbol( s2, n5 ).get_contract().value).toStrictEqual( bigInt("2975281302211218015") )
    expect( extended_symbol( s3, n6 ).get_contract().value).toStrictEqual( bigInt("3570337562653461615") )
    expect( extended_symbol( s3, n7 ).get_contract().value).toStrictEqual( u64max )

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

    // -------------------------------------------------------------------------------
    // friend constexpr bool operator==(const extended_symbol&, const extended_symbol&)
    expect( extended_symbol( s0, n0 ).isEqual( extended_symbol( s0, n0 ))).toBeTruthy()
    expect( extended_symbol( s1, n3 ).isEqual( extended_symbol( s1, n3 ))).toBeTruthy()
    expect( extended_symbol( s2, n4 ).isEqual( extended_symbol( s2, n4 ))).toBeTruthy()
    expect( extended_symbol( s3, n7 ).isEqual( extended_symbol( s3, n7 ))).toBeTruthy()

    // -------------------------------------------------------------------------------
    // friend constexpr bool operator!=(const extended_symbol&, const extended_symbol&)
    expect( extended_symbol().isNotEqual( extended_symbol( s0 ))).toBeTruthy()
    expect( extended_symbol( s0 ).isNotEqual( extended_symbol( s1 ))).toBeTruthy()
    expect( extended_symbol( s1 ).isNotEqual( extended_symbol( s2 ))).toBeTruthy()
    expect( extended_symbol( s2 ).isNotEqual( extended_symbol( s3 ))).toBeTruthy()

    // -------------------------------------------------------------------------------
    // friend constexpr bool operator<(const extended_symbol&, const extended_symbol&)
    expect( extended_symbol().isLessThan( extended_symbol( s0 ))).toBeTruthy()
    expect( extended_symbol().isLessThan( extended_symbol( s1 ))).toBeTruthy()
    expect( extended_symbol().isLessThan( extended_symbol( s2 ))).toBeTruthy()
    expect( extended_symbol().isLessThan( extended_symbol( s3 ))).toBeTruthy()
})