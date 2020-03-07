// Definitions in `eosio.cdt/libraries/eosio/symbol.hpp`
EOSIO_TEST_BEGIN(extended_symbol_type_test)
   static constexpr name n0{"1"};
   static constexpr name n1{"5"};
   static constexpr name n2{"a"};
   static constexpr name n3{"z"};
   static constexpr name n4{"111111111111j"};
   static constexpr name n5{"555555555555j"};
   static constexpr name n6{"aaaaaaaaaaaaj"};
   static constexpr name n7{"zzzzzzzzzzzzj"};

   static constexpr symbol s0{"A",0};
   static constexpr symbol s1{"Z",0};
   static constexpr symbol s2{"AAAAAAA",255};
   static constexpr symbol s3{"ZZZZZZZ",255};

   //// constexpr extended_symbol()
   // constexpr name get_symbol()
   // constexpr name get_contract()
   CHECK_EQUAL( (extended_symbol{{}, {}}.get_symbol().raw()), 0ULL )
   CHECK_EQUAL( (extended_symbol{{}, {}}.get_contract().value), 0ULL )

   //// constexpr extended_symbol(symbol, name)
   CHECK_EQUAL( (extended_symbol{s0, n0}.get_symbol().raw()), 16640ULL )
   CHECK_EQUAL( (extended_symbol{s0, n1}.get_symbol().code().raw()), 65ULL )
   CHECK_EQUAL( (extended_symbol{s1, n2}.get_symbol().raw()), 23040ULL )
   CHECK_EQUAL( (extended_symbol{s1, n3}.get_symbol().code().raw()), 90ULL )
   CHECK_EQUAL( (extended_symbol{s0, n0}.get_contract().value), 576460752303423488ULL )
   CHECK_EQUAL( (extended_symbol{s0, n1}.get_contract().value), 2882303761517117440ULL )
   CHECK_EQUAL( (extended_symbol{s1, n2}.get_contract().value), 3458764513820540928ULL )
   CHECK_EQUAL( (extended_symbol{s1, n3}.get_contract().value), 17870283321406128128ULL )
   CHECK_EQUAL( (extended_symbol{s2, n4}.get_symbol().raw()), 4702111234474983935ULL )
   CHECK_EQUAL( (extended_symbol{s2, n5}.get_symbol().code().raw()), 18367622009667905ULL )
   CHECK_EQUAL( (extended_symbol{s3, n6}.get_symbol().raw()), 6510615555426900735ULL )
   CHECK_EQUAL( (extended_symbol{s3, n7}.get_symbol().code().raw()), 25432092013386330ULL )
   CHECK_EQUAL( (extended_symbol{s2, n4}.get_contract().value), 595056260442243615ULL )
   CHECK_EQUAL( (extended_symbol{s2, n5}.get_contract().value), 2975281302211218015ULL )
   CHECK_EQUAL( (extended_symbol{s3, n6}.get_contract().value), 3570337562653461615ULL )
   CHECK_EQUAL( (extended_symbol{s3, n7}.get_contract().value), u64max )

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
   CHECK_EQUAL( (extended_symbol{s0, n0} == extended_symbol{s0, n0}), true )
   CHECK_EQUAL( (extended_symbol{s1, n3} == extended_symbol{s1, n3}), true )
   CHECK_EQUAL( (extended_symbol{s2, n4} == extended_symbol{s2, n4}), true )
   CHECK_EQUAL( (extended_symbol{s3, n7} == extended_symbol{s3, n7}), true )

   // -------------------------------------------------------------------------------
   // friend constexpr bool operator!=(const extended_symbol&, const extended_symbol&)
   CHECK_EQUAL( (extended_symbol{} != extended_symbol{s0, {}}), true )
   CHECK_EQUAL( (extended_symbol{s0, {}} != extended_symbol{s1, {}}), true )
   CHECK_EQUAL( (extended_symbol{s1, {}} != extended_symbol{s2, {}}), true )
   CHECK_EQUAL( (extended_symbol{s2, {}} != extended_symbol{s3, {}}), true )

   // -------------------------------------------------------------------------------
   // friend constexpr bool operator<(const extended_symbol&, const extended_symbol&)
   CHECK_EQUAL( (extended_symbol{} < extended_symbol{s0, {}}), true )
   CHECK_EQUAL( (extended_symbol{} < extended_symbol{s1, {}}), true )
   CHECK_EQUAL( (extended_symbol{} < extended_symbol{s2, {}}), true )
   CHECK_EQUAL( (extended_symbol{} < extended_symbol{s3, {}}), true )
EOSIO_TEST_END