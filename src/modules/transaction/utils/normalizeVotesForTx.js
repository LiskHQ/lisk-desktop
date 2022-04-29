/**
 * Converts the votes object stored in Redux store
 * which looks like { delegateAddress: { confirmed, unconfirmed } }
 * into an array of objects that Lisk Element expects, looking like
 * [{ delegatesAddress, amount }]
 *
 * @param {Object} votes - votes object retrieved from the Redux store
 * @returns {Array} Array of votes as Lisk Element expects
 */
export const normalizeVotesForTx = votes =>
  Object.keys(votes)
    .filter(address => votes[address].confirmed !== votes[address].unconfirmed)
    .map(delegateAddress => ({
      delegateAddress,
      amount: (votes[delegateAddress].unconfirmed - votes[delegateAddress].confirmed).toString(),
    }));
