/**
 * Converts the votes object stored in Redux store
 * which looks like { validatorAddress: { confirmed, unconfirmed } }
 * into an array of objects that Lisk Element expects, looking like
 * [{ delegatesAddress, amount }]
 *
 * @param {Object} votes - votes object retrieved from the Redux store
 * @returns {Array} Array of votes as Lisk Element expects
 */
const normalizeStakesForTx = votes =>
  Object.keys(votes)
    .filter(address => votes[address].confirmed !== votes[address].unconfirmed)
    .map(validatorAddress => ({
      validatorAddress,
      amount: (votes[validatorAddress].unconfirmed - votes[validatorAddress].confirmed).toString(),
    }));

export default normalizeStakesForTx;
