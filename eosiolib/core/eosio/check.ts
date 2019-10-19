// https://github.com/EOSIO/eosio.cdt/blob/master/libraries/eosiolib/core/eosio/check.hpp

/**
 * Assert if the predicate fails and use the supplied message.
 *
 * @param {boolean} pred Pre-condition
 * @param {string} msg Error Message
 * @returns {void}
 * @example
 *
 * check(a == b, "a does not equal b");
 */
export function check(pred: boolean, msg: string): void {
    if (!pred) {
        throw new Error(msg);
    }
}
