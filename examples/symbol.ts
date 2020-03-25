import { symbol, symbol_code} from "../index"

const sym = symbol("9,EOSDT");
console.log(sym.precision());
console.log(sym.code().to_string());
console.log(sym.code().raw());

const symcode = symbol_code("EOSDT");
console.log(symcode.to_string());
console.log(symcode.raw());
