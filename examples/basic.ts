import { Asset, Symbol } from "../"

const quantity = new Asset(10000, new Symbol("EOS", 4));
console.log(quantity.to_string());
