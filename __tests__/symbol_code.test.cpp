static constexpr uint64_t u64min = numeric_limits<uint64_t>::min(); // 0ULL
static constexpr uint64_t u64max = numeric_limits<uint64_t>::max(); // 18446744073709551615ULL

// Definitions in `eosio.cdt/libraries/eosio/symbol.hpp`
EOSIO_TEST_BEGIN(symbol_code_type_test)
   //// constexpr symbol_code()
   // constexpr uint64_t raw()const
   CHECK_EQUAL( symbol_code{}.raw(), 0ULL )

   //// constexpr explicit symbol_code(uint64_t raw)
   CHECK_EQUAL( symbol_code{0ULL}.raw(), 0ULL )
   CHECK_EQUAL( symbol_code{1ULL}.raw(), 1ULL )
   CHECK_EQUAL( symbol_code{u64max}.raw(), u64max )

   //// constexpr explicit symbol_code(string_view str)
   CHECK_EQUAL( symbol_code{"A"}.raw(), 65ULL )
   CHECK_EQUAL( symbol_code{"Z"}.raw(), 90ULL )
   CHECK_EQUAL( symbol_code{"AAAAAAA"}.raw(), 18367622009667905ULL )
   CHECK_EQUAL( symbol_code{"ZZZZZZZ"}.raw(), 25432092013386330ULL )

   CHECK_ASSERT( "string is too long to be a valid symbol_code", ([]() {symbol_code{"ABCDEFGH"};}) )
   CHECK_ASSERT( "only uppercase letters allowed in symbol_code string", ([]() {symbol_code{"a"};}) )
   CHECK_ASSERT( "only uppercase letters allowed in symbol_code string", ([]() {symbol_code{"z"};}) )
   CHECK_ASSERT( "only uppercase letters allowed in symbol_code string", ([]() {symbol_code{"@"};}) )
   CHECK_ASSERT( "only uppercase letters allowed in symbol_code string", ([]() {symbol_code{"["};}) )

   // ------------------------------
   // constexpr bool is_valid()const
   CHECK_EQUAL( symbol_code{65ULL}.is_valid(), true ) // "A"
   CHECK_EQUAL( symbol_code{90ULL}.is_valid(), true ) // "Z"
   CHECK_EQUAL( symbol_code{18367622009667905ULL}.is_valid(), true ) // "AAAAAAA"
   CHECK_EQUAL( symbol_code{25432092013386330ULL}.is_valid(), true ) // "ZZZZZZZ"

   CHECK_EQUAL( symbol_code{64ULL}.is_valid(), false )
   CHECK_EQUAL( symbol_code{25432092013386331ULL}.is_valid(), false )

   // --------------------------------
   // constexpr uint32_t length()const
   CHECK_EQUAL( symbol_code{""}.length(), 0 )
   CHECK_EQUAL( symbol_code{"S"}.length(), 1 )
   CHECK_EQUAL( symbol_code{"SY"}.length(), 2 )
   CHECK_EQUAL( symbol_code{"SYM"}.length(), 3 )
   CHECK_EQUAL( symbol_code{"SYMB"}.length(), 4 )
   CHECK_EQUAL( symbol_code{"SYMBO"}.length(), 5 )
   CHECK_EQUAL( symbol_code{"SYMBOL"}.length(), 6 )
   CHECK_EQUAL( symbol_code{"SYMBOLL"}.length(), 7 )

   // ---------------------------------------
   // constexpr explicit operator bool()const
   CHECK_EQUAL( symbol_code{0ULL}.operator bool(), false )
   CHECK_EQUAL( symbol_code{1ULL}.operator bool(), true )
   CHECK_EQUAL( !symbol_code{0ULL}.operator bool(), true )
   CHECK_EQUAL( !symbol_code{1ULL}.operator bool(), false )

   CHECK_EQUAL( symbol_code{""}.operator bool(), false )
   CHECK_EQUAL( symbol_code{"SYMBOL"}.operator bool(), true )
   CHECK_EQUAL( !symbol_code{""}.operator bool(), true )
   CHECK_EQUAL( !symbol_code{"SYMBOL"}.operator bool(), false )

   // ----------------------------------------
   // char* write_as_string(char*, char*)const
   char buffer[7]{};

   string test_str{"A"};
   symbol_code{test_str}.write_as_string( buffer, buffer + sizeof(buffer) );
   CHECK_EQUAL( memcmp(test_str.c_str(), buffer, strlen(test_str.c_str())), 0 )
   symbol_code{test_str = "Z"}.write_as_string( buffer, buffer + sizeof(buffer) );
   CHECK_EQUAL( memcmp(test_str.c_str(), buffer, strlen(test_str.c_str())), 0 )
   symbol_code{test_str = "AAAAAAA"}.write_as_string( buffer, buffer + sizeof(buffer) );
   CHECK_EQUAL( memcmp(test_str.c_str(), buffer, strlen(test_str.c_str())), 0 )
   symbol_code{test_str = "ZZZZZZZ"}.write_as_string( buffer, buffer + sizeof(buffer) );
   CHECK_EQUAL( memcmp(test_str.c_str(), buffer, strlen(test_str.c_str())), 0 )

   // -----------------------
   // string to_string()const
   CHECK_EQUAL( symbol_code{"A"}.to_string(), "A" )
   CHECK_EQUAL( symbol_code{"Z"}.to_string(), "Z" )
   CHECK_EQUAL( symbol_code{"AAAAAAA"}.to_string(), "AAAAAAA" )
   CHECK_EQUAL( symbol_code{"ZZZZZZZ"}.to_string(), "ZZZZZZZ" )

   // --------------------------------------------------------------
   // friend bool operator==(const symbol_code&, const symbol_code&)
   CHECK_EQUAL( symbol_code{"A"} == symbol_code{"A"}, true )
   CHECK_EQUAL( symbol_code{"Z"} == symbol_code{"Z"}, true )
   CHECK_EQUAL( symbol_code{"AAAAAAA"} == symbol_code{"AAAAAAA"}, true )
   CHECK_EQUAL( symbol_code{"ZZZZZZZ"} == symbol_code{"ZZZZZZZ"}, true )

   // --------------------------------------------------------------
   // friend bool operator!=(const symbol_code&, const symbol_code&)
   CHECK_EQUAL( symbol_code{"A"} != symbol_code{}, true )
   CHECK_EQUAL( symbol_code{"Z"} != symbol_code{}, true )
   CHECK_EQUAL( symbol_code{"AAAAAAA"} != symbol_code{}, true )
   CHECK_EQUAL( symbol_code{"ZZZZZZZ"} != symbol_code{}, true )

   // -------------------------------------------------------------
   // friend bool operator<(const symbol_code&, const symbol_code&)
   CHECK_EQUAL( symbol_code{} < symbol_code{"A"}, true )
   CHECK_EQUAL( symbol_code{} < symbol_code{"Z"}, true )
   CHECK_EQUAL( symbol_code{} < symbol_code{"AAAAAAA"}, true )
   CHECK_EQUAL( symbol_code{} < symbol_code{"ZZZZZZZ"}, true )
EOSIO_TEST_END
