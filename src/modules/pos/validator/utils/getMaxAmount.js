import { MIN_ACCOUNT_BALANCE, STAKE_AMOUNT_STEP } from '@transaction/configuration/transactions';

/**
 * Calculates the maximum stake amount possible. It
 * Takes the current stakes, minimum account balance and
 * transaction fee into account.
 */
const getMaxAmount = async ({ balance, staking, address }) => {
  const totalUnconfirmedStakes = Object.values(staking)
    .filter((stake) => stake.confirmed < stake.unconfirmed)
    .map((stake) => stake.unconfirmed - stake.confirmed)
    .reduce((total, amount) => total + amount, 0);
  const currentStake = staking[address] ? staking[address].confirmed : 0;

  const maxStakeAmount =
    Math.floor((balance - (totalUnconfirmedStakes + currentStake + MIN_ACCOUNT_BALANCE)) / 1e9) *
    1e9;

  if (
    BigInt(maxStakeAmount) <=
    BigInt(balance - totalUnconfirmedStakes + currentStake - MIN_ACCOUNT_BALANCE)
  ) {
    return maxStakeAmount;
  }
  return maxStakeAmount - STAKE_AMOUNT_STEP;
};

export default getMaxAmount;
