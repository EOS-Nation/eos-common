// https://github.com/EOSIO/eosio.contracts/blob/master/contracts/eosio.system/src/voting.cpp


/**
 * voteWeightToday computes the stake2vote weight for EOS, in order to compute the decaying value.
 */
export function voteWeightToday(): number {
  const seconds_per_day = 86400;
  const block_timestamp_epoch = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)).getTime();

  return Math.floor( (Date.now() - block_timestamp_epoch) / 1000 / (seconds_per_day * 7)) / 52;
}

/**
 * Convert EOS stake into decaying value
 *
 * @param {number} vote vote
 */
export function stake2vote( staked: number ): number {
  return staked * Math.pow(2, voteWeightToday());
}

/**
 * Convert vote decay value into EOS stake
 *
 * @param {number} staked staked
 */
export function vote2stake( vote: number ): number {
  return vote / Math.pow(2, voteWeightToday());
}
