import { asset } from "../index"

const quantity = asset("1.0000 EOS");
console.log(quantity.amount);
console.log(quantity.symbol.precision());
