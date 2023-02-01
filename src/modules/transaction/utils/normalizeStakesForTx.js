/**
 * Converts the stakes object stored in Redux store
 * which looks like { validatorAddress: { confirmed, unconfirmed } }
 * into an array of objects that Lisk Element expects, looking like
 * [{ validatorAddress, amount }]
 *
 * @param {Object} stakes - stakes object retrieved from the Redux store
 * @returns {Array} Array of stakes as Lisk Element expects
 */
const normalizeStakesForTx = stakes =>
  Object.keys(stakes)
    .filter(address => stakes[address].confirmed !== stakes[address].unconfirmed)
    .map(validatorAddress => ({
      validatorAddress,
      amount: (stakes[validatorAddress].unconfirmed - stakes[validatorAddress].confirmed).toString(),
    }));

export default normalizeStakesForTx;
