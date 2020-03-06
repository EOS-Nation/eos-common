/**
 *  @file
 *  @copyright defined in eosio.cdt/LICENSE.txt
 */

#include <string>

#include <eosio/tester.hpp>
#include <eosio/asset.hpp>

using std::string;

using eosio::name;
using eosio::symbol;
using eosio::extended_symbol;
using eosio::asset;
using eosio::extended_asset;

static constexpr int64_t asset_mask{(1LL << 62) - 1};
static constexpr int64_t asset_min{-asset_mask}; // -4611686018427387903
static constexpr int64_t asset_max{ asset_mask}; //  4611686018427387903

// Definitions in `eosio.cdt/libraries/eosio/asset.hpp`
EOSIO_TEST_BEGIN(extended_asset_type_test)
   static constexpr symbol sym_no_prec{"SYMBOLL",0};
   static constexpr symbol sym_prec{"SYMBOLL",63};

   static constexpr extended_symbol ext_sym_no_prec{sym_no_prec, name{"eosioaccountj"}};
   static constexpr extended_symbol ext_sym_prec{sym_prec, name{"eosioaccountj"}};

   static const asset asset_no_prec{0LL, sym_no_prec};
   static const asset asset_prec{0LL, sym_prec};

   //// extended_asset()
   CHECK_EQUAL( extended_asset{}.quantity, asset{} )
   CHECK_EQUAL( extended_asset{}.contract, name{}  )

   //// extended_asset(int64_t, extended_symbol)
   CHECK_EQUAL( (extended_asset{{},ext_sym_no_prec}.quantity), (asset{0LL, sym_no_prec}) )
   CHECK_EQUAL( (extended_asset{{},ext_sym_no_prec}.contract), (name{"eosioaccountj"}) )

   //// extended_asset(asset, name)
   CHECK_EQUAL( (extended_asset{asset_no_prec, name{"eosioaccountj"}}.quantity), (asset{ 0LL, sym_no_prec}) )
   CHECK_EQUAL( (extended_asset{asset_no_prec, name{"eosioaccountj"}}.contract), (name{"eosioaccountj"}) )

   // ------------------------------------------
   // extended_symbol get_extended_symbol()const
   CHECK_EQUAL( (extended_asset{{},ext_sym_no_prec}.get_extended_symbol()), (ext_sym_no_prec) )
   CHECK_EQUAL( (extended_asset{{},ext_sym_prec}.get_extended_symbol()), (ext_sym_prec) )

   // -----------------
   // void print()const
   CHECK_PRINT( "0 A@1", [](){extended_asset{asset{int64_t{0}, symbol{"A", 0}}, name{"1"}}.print();} )
   CHECK_PRINT( "0 A@5", [](){extended_asset{asset{int64_t{0}, symbol{"A", 0}}, name{"5"}}.print();} )
   CHECK_PRINT( "0 Z@a", [](){extended_asset{asset{int64_t{0}, symbol{"Z", 0}}, name{"a"}}.print();} )
   CHECK_PRINT( "0 Z@z", [](){extended_asset{asset{int64_t{0}, symbol{"Z", 0}}, name{"z"}}.print();} )

   CHECK_PRINT( "1.1 A@1", [](){extended_asset{asset{int64_t{11}, symbol{"A", 1}}, name{"1"}}.print();} )
   CHECK_PRINT( "1.1 A@5", [](){extended_asset{asset{int64_t{11}, symbol{"A", 1}}, name{"5"}}.print();} )
   CHECK_PRINT( "1.1 Z@a", [](){extended_asset{asset{int64_t{11}, symbol{"Z", 1}}, name{"a"}}.print();} )
   CHECK_PRINT( "1.1 Z@z", [](){extended_asset{asset{int64_t{11}, symbol{"Z", 1}}, name{"z"}}.print();} )

   CHECK_PRINT( "0.000000000000000000000000000000000000000000000000000000000000011 A@1",
      [](){extended_asset{asset{int64_t{11}, symbol{"A", 63}}, name{"1"}}.print();} )
   CHECK_PRINT( "0.000000000000000000000000000000000000000000000000000000000000011 A@5",
      [](){extended_asset{asset{int64_t{11}, symbol{"A", 63}}, name{"5"}}.print();} )
   CHECK_PRINT( "0.000000000000000000000000000000000000000000000000000000000000011 Z@a",
      [](){extended_asset{asset{int64_t{11}, symbol{"Z", 63}}, name{"a"}}.print();} )
   CHECK_PRINT( "0.000000000000000000000000000000000000000000000000000000000000011 Z@z",
      [](){extended_asset{asset{int64_t{11}, symbol{"Z", 63}}, name{"z"}}.print();} )

   CHECK_PRINT( "0 AAAAAAA@111111111111j", [](){extended_asset{asset{int64_t{0}, symbol{"AAAAAAA", 0}}, name{"111111111111j"}}.print();} )
   CHECK_PRINT( "0 AAAAAAA@555555555555j", [](){extended_asset{asset{int64_t{0}, symbol{"AAAAAAA", 0}}, name{"555555555555j"}}.print();} )
   CHECK_PRINT( "0 ZZZZZZZ@aaaaaaaaaaaaj", [](){extended_asset{asset{int64_t{0}, symbol{"ZZZZZZZ", 0}}, name{"aaaaaaaaaaaaj"}}.print();} )
   CHECK_PRINT( "0 ZZZZZZZ@zzzzzzzzzzzzj", [](){extended_asset{asset{int64_t{0}, symbol{"ZZZZZZZ", 0}}, name{"zzzzzzzzzzzzj"}}.print();} )

   CHECK_PRINT( "11 AAAAAAA@111111111111j", [](){extended_asset{asset{int64_t{11}, symbol{"AAAAAAA", 0}}, name{"111111111111j"}}.print();} )
   CHECK_PRINT( "11 AAAAAAA@555555555555j", [](){extended_asset{asset{int64_t{11}, symbol{"AAAAAAA", 0}}, name{"555555555555j"}}.print();} )
   CHECK_PRINT( "11 ZZZZZZZ@aaaaaaaaaaaaj", [](){extended_asset{asset{int64_t{11}, symbol{"ZZZZZZZ", 0}}, name{"aaaaaaaaaaaaj"}}.print();} )
   CHECK_PRINT( "11 ZZZZZZZ@zzzzzzzzzzzzj", [](){extended_asset{asset{int64_t{11}, symbol{"ZZZZZZZ", 0}}, name{"zzzzzzzzzzzzj"}}.print();} )

   CHECK_PRINT( "0.000000000000000000000000000000000000000000000000000000000000011 AAAAAAA@111111111111j",
     [](){extended_asset{asset{int64_t{11}, symbol{"AAAAAAA", 63}}, name{"111111111111j"}}.print();} )
   CHECK_PRINT( "0.000000000000000000000000000000000000000000000000000000000000011 AAAAAAA@555555555555j",
     [](){extended_asset{asset{int64_t{11}, symbol{"AAAAAAA", 63}}, name{"555555555555j"}}.print();} )
   CHECK_PRINT( "0.000000000000000000000000000000000000000000000000000000000000011 ZZZZZZZ@aaaaaaaaaaaaj",
     [](){extended_asset{asset{int64_t{11}, symbol{"ZZZZZZZ", 63}}, name{"aaaaaaaaaaaaj"}}.print();} )
   CHECK_PRINT( "0.000000000000000000000000000000000000000000000000000000000000011 ZZZZZZZ@zzzzzzzzzzzzj",
     [](){extended_asset{asset{int64_t{11}, symbol{"ZZZZZZZ", 63}}, name{"zzzzzzzzzzzzj"}}.print();} )

   // -------------------------------
   // extended_asset operator-()const
   CHECK_EQUAL( (-extended_asset{asset{ 0, sym_no_prec}, {}}.quantity), (extended_asset{asset_no_prec, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{-0, sym_no_prec}, {}}.quantity), (extended_asset{asset_no_prec, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{ 0, sym_prec}, {}}.quantity), (extended_asset{asset_prec, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{-0, sym_prec}, {}}.quantity), (extended_asset{asset_prec, {}}.quantity) )

   CHECK_EQUAL( (-extended_asset{asset{1LL, sym_no_prec}, {}}.quantity), (extended_asset{asset{-1LL, sym_no_prec}, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{1LL, sym_no_prec}, {}}.quantity), (extended_asset{asset{-1LL, sym_no_prec}, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{1LL, sym_prec}, {}}.quantity), (extended_asset{asset{-1LL, sym_prec}, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{1LL, sym_prec}, {}}.quantity), (extended_asset{asset{-1LL, sym_prec}, {}}.quantity) )

   CHECK_EQUAL( (-extended_asset{asset{asset_max, sym_no_prec}, {}}.quantity), (extended_asset{asset{asset_min, sym_no_prec}, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{asset_max, sym_no_prec}, {}}.quantity), (extended_asset{asset{asset_min, sym_no_prec}, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{asset_max, sym_prec}, {}}.quantity), (extended_asset{asset{asset_min, sym_prec}, {}}.quantity) )
   CHECK_EQUAL( (-extended_asset{asset{asset_max, sym_prec}, {}}.quantity), (extended_asset{asset{asset_min, sym_prec}, {}}.quantity) )

   // -----------------------------------------------------------------------------
   // friend extended_asset operator+(const extended_asset&, const extended_asset&)
   CHECK_EQUAL( (extended_asset{asset{0LL, sym_no_prec}, {}} + extended_asset{asset{ 0LL, sym_no_prec}, {}}), (extended_asset{asset_no_prec, {}}) )
   CHECK_EQUAL( (extended_asset{asset{1LL, sym_no_prec}, {}} + extended_asset{asset{-1LL, sym_no_prec}, {}}), (extended_asset{asset_no_prec, {}}) )

   CHECK_ASSERT( "type mismatch", (
      [&]() {
         extended_asset{asset_no_prec, name{"eosioaccountj"}} + extended_asset{asset_no_prec, name{"jtnuoccaoisoe"}};
      })
   )

   // -------------------------------------------------------------------------
   // friend extended_asset& operator+=(extended_asset&, const extended_asset&)
   extended_asset temp{asset_no_prec, {}};
   CHECK_EQUAL( (temp += temp), (extended_asset{asset_no_prec, {}}) )
   temp = extended_asset{asset{1LL, sym_no_prec}, {}};
   CHECK_EQUAL( (temp += extended_asset{asset{-1LL, sym_no_prec}, {}}), (extended_asset{asset_no_prec, {}}) )

   CHECK_ASSERT( "type mismatch", (
      [&]() {
         temp += extended_asset{asset_no_prec, name{"eosioaccountj"}};
      })
   )

   // -----------------------------------------------------------------------------
   // friend extended_asset operator-(const extended_asset&, const extended_asset&)
   CHECK_EQUAL( (extended_asset{asset_no_prec, {}} - extended_asset{asset_no_prec, {}}),
                  (extended_asset{asset_no_prec, {}}) )
   CHECK_EQUAL( (extended_asset{asset{1LL, sym_no_prec}, {}} - extended_asset{asset{1LL, sym_no_prec}, {}}),
                  (extended_asset{asset{asset_no_prec}, {}}) )

   CHECK_ASSERT( "type mismatch", (
      [&]() {
         extended_asset{asset_no_prec, name{"eosioaccountj"}} - extended_asset{asset_no_prec, name{"jtnuoccaoisoe"}};
      })
   )

   // --------------------------------------------------------------------------
   // friend extended_asset& operator-=(extended_asset&, const extended_asset&)
   temp = extended_asset{asset_no_prec, {}};
   CHECK_EQUAL( (temp -= temp), (extended_asset{asset_no_prec, {}}) )
   temp = extended_asset{asset{1LL, sym_no_prec}, {}};
   CHECK_EQUAL( (temp -= temp), (extended_asset{asset_no_prec, {}}) )

   CHECK_ASSERT( "type mismatch", (
      [&]() {
         temp -= extended_asset{asset_no_prec, name{"jtnuoccaoisoe"}};
      })
   )

   // --------------------------------------------------------------------
   // friend bool operator==(const extended_asset&, const extended_asset&)
   CHECK_EQUAL( (extended_asset{asset_no_prec, {}} == extended_asset{asset_no_prec, {}}), true )
   CHECK_EQUAL( (extended_asset{asset{1LL, sym_no_prec}, {}} == extended_asset{asset{1LL, sym_no_prec}, {}}), true )

   // --------------------------------------------------------------------
   // friend bool operator!=(const extended_asset&, const extended_asset&)
   CHECK_EQUAL( (extended_asset{asset_no_prec, name{"eosioaccountj"}} != extended_asset{asset_no_prec, name{"jtnuoccaoisoe"}}), true )
   CHECK_EQUAL( (extended_asset{asset{1LL, sym_no_prec}, {}} != extended_asset{asset{-1LL, sym_no_prec}, {}}), true )
   CHECK_EQUAL( (extended_asset{asset{1LL, sym_no_prec}, {}} != extended_asset{asset{ 0LL, sym_no_prec}, name{"eosioaccountj"}}), true )

   // -------------------------------------------------------------------
   // friend bool operator<(const extended_asset&, const extended_asset&)
   CHECK_EQUAL( (extended_asset{asset_no_prec, name{}} < extended_asset{asset{ 1LL, sym_no_prec}, {}}), true )
   CHECK_ASSERT( "type mismatch", (
      [&]() {
         bool b{extended_asset{{}, name{}} < extended_asset{{}, name{"eosioaccountj"}}};
         return b;
      })
   )

   // --------------------------------------------------------------------
   // friend bool operator<=(const extended_asset&, const extended_asset&)
   CHECK_EQUAL( (extended_asset{asset_no_prec, name{}} <= extended_asset{asset{ 1LL, sym_no_prec}, {}}), true );
   CHECK_ASSERT( "type mismatch", (
      [&]() {
         bool b{extended_asset{{}, name{}} <= extended_asset{{}, name{"eosioaccountj"}}};
         return b;
      })
   )

   // --------------------------------------------------------------------
   // friend bool operator>=(const extended_asset&, const extended_asset&)
   CHECK_EQUAL( (extended_asset{asset{ 1LL, sym_no_prec}, {}} >= extended_asset{asset_no_prec, name{}}), true );
   CHECK_ASSERT( "type mismatch", (
      [&]() {
         bool b{extended_asset{{}, name{}} >= extended_asset{{}, name{"eosioaccountj"}}};
         return b;
      })
   )
EOSIO_TEST_END