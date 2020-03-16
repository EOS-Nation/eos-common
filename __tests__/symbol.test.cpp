
// Definitions in `eosio.cdt/libraries/eosio/symbol.hpp`
EOSIO_TEST_BEGIN(symbol_type_test)
   static constexpr symbol_code sc0{"A"};
   static constexpr symbol_code sc1{"Z"};
   static constexpr symbol_code sc2{"AAAAAAA"};
   static constexpr symbol_code sc3{"ZZZZZZZ"};

   //// constexpr symbol()
   // constexpr uint64_t raw()const
   CHECK_EQUAL( symbol{}.raw(), 0ULL )

   //// constexpr explicit symbol(uint64_t)
   CHECK_EQUAL( symbol{0ULL}.raw(), 0ULL )
   CHECK_EQUAL( symbol{1ULL}.raw(), 1ULL )
   CHECK_EQUAL( symbol{u64max}.raw(), u64max )

   //// constexpr symbol(string_view, uint8_t)
   // Note:
   // Unless constructed with `initializer_list`, precision does not check for wrap-around
   CHECK_EQUAL( (symbol{sc0, 0}.raw()), 16640ULL )
   CHECK_EQUAL( (symbol{sc1, 0}.raw()), 23040ULL )
   CHECK_EQUAL( (symbol{sc2, 0}.raw()), 4702111234474983680ULL )
   CHECK_EQUAL( (symbol{sc3, 0}.raw()), 6510615555426900480ULL )

   //// constexpr symbol(symbol_code, uint8_t)
   CHECK_EQUAL( (symbol{sc0, 0}.raw()), 16640ULL )
   CHECK_EQUAL( (symbol{sc1, 0}.raw()), 23040ULL )
   CHECK_EQUAL( (symbol{sc2, 0}.raw()), 4702111234474983680ULL )
   CHECK_EQUAL( (symbol{sc3, 0}.raw()), 6510615555426900480ULL )

   // --------------------
   // bool is_valid()const
   CHECK_EQUAL( symbol{16640ULL}.is_valid(), true ) // "A", precision: 0
   CHECK_EQUAL( symbol{23040ULL}.is_valid(), true ) // "Z", precision: 0
   CHECK_EQUAL( symbol{4702111234474983680ULL}.is_valid(), true ) // "AAAAAAA", precision: 0
   CHECK_EQUAL( symbol{6510615555426900480ULL}.is_valid(), true ) // "ZZZZZZZ", precision: 0

   CHECK_EQUAL( symbol{16639ULL}.is_valid(), false )
   CHECK_EQUAL( symbol{6510615555426900736ULL}.is_valid(), false )

   // -------------------------
   // uint8_t precision()const
   CHECK_EQUAL( (symbol{sc0,0}.precision()), 0 )
   CHECK_EQUAL( (symbol{sc1,0}.precision()), 0 )
   CHECK_EQUAL( (symbol{sc2,0}.precision()), 0 )
   CHECK_EQUAL( (symbol{sc3,0}.precision()), 0 )

   CHECK_EQUAL( (symbol{sc0,255}.precision()), 255 )
   CHECK_EQUAL( (symbol{sc1,255}.precision()), 255 )
   CHECK_EQUAL( (symbol{sc2,255}.precision()), 255 )
   CHECK_EQUAL( (symbol{sc3,255}.precision()), 255 )

   // -----------------------
   // symbol_code code()const
   CHECK_EQUAL( (symbol{sc0,0}.code()), sc0 )
   CHECK_EQUAL( (symbol{sc1,0}.code()), sc1 )
   CHECK_EQUAL( (symbol{sc2,0}.code()), sc2 )
   CHECK_EQUAL( (symbol{sc3,0}.code()), sc3 )

   // ---------------------------------------
   // constexpr explicit operator bool()const
   CHECK_EQUAL( symbol{0}.operator bool(), false )
   CHECK_EQUAL( symbol{1}.operator bool(), true )
   CHECK_EQUAL( !symbol{0}.operator bool(), true )
   CHECK_EQUAL( !symbol{1}.operator bool(), false )

   CHECK_EQUAL( (symbol{"", 0}.operator bool()), false )
   CHECK_EQUAL( (symbol{"SYMBOLL", 0}.operator bool()), true )
   CHECK_EQUAL( (!symbol{"", 0}.operator bool()), true )
   CHECK_EQUAL( (!symbol{"SYMBOLL", 0}.operator bool()), false )

   // ---------------------
   // void print(bool)const
   CHECK_PRINT( "0,A", [&](){symbol{"A", 0}.print(true);} );
   CHECK_PRINT( "0,Z", [&](){symbol{"Z", 0}.print(true);} );
   CHECK_PRINT( "255,AAAAAAA", [&](){symbol{"AAAAAAA", 255}.print(true);} );
   CHECK_PRINT( "255,ZZZZZZZ", [&](){symbol{"ZZZZZZZ", 255}.print(true);} );

   // --------------------------------------------------------------
   // friend constexpr bool operator==(const symbol&, const symbol&)
   CHECK_EQUAL( (symbol{sc0, 0} == symbol{sc0, 0}), true )
   CHECK_EQUAL( (symbol{sc1, 0} == symbol{sc1, 0}), true )
   CHECK_EQUAL( (symbol{sc2, 0} == symbol{sc2, 0}), true )
   CHECK_EQUAL( (symbol{sc3, 0} == symbol{sc3, 0}), true )

   // --------------------------------------------------------------
   // friend constexpr bool operator!=(const symbol&, const symbol&)
   CHECK_EQUAL( (symbol{sc0, 0} != symbol{}), true )
   CHECK_EQUAL( (symbol{sc1, 0} != symbol{}), true )
   CHECK_EQUAL( (symbol{sc2, 0} != symbol{}), true )
   CHECK_EQUAL( (symbol{sc3, 0} != symbol{}), true )

   // --------------------------------------------------------------
   // friend constexpr bool operator<(const symbol&, const symbol&)
   CHECK_EQUAL( (symbol{} < symbol{sc0, 0}), true )
   CHECK_EQUAL( (symbol{} < symbol{sc1, 0}), true )
   CHECK_EQUAL( (symbol{} < symbol{sc2, 0}), true )
   CHECK_EQUAL( (symbol{} < symbol{sc3, 0}), true )
EOSIO_TEST_END
