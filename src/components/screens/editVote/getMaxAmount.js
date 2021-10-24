import { getTransactionFee } from '@api/transaction';
import {
  VOTE_AMOUNT_STEP,
  MIN_ACCOUNT_BALANCE,
  MODULE_ASSETS_NAME_ID_MAP,
} from '@constants';
import { toRawLsk } from '@utils/lsk';
import { normalizeVotesForTx, getNumberOfSignatures } from '@shared/transactionPriority';

/**
 * Calculates the maximum vote amount possible. It
 * Takes the current votes, minimum account balance and
 * transaction fee into account.
 *
 * @param {object} account - Lisk account info from the Redux store
 * @param {object} network - Network info from the Redux store
 * @param {object} transaction - Raw transaction object
 * @param {object} voting - List of votes from the Redux store
 * @returns {Number} - Maximum possible vote amount
 */
// eslint-disable-next-line
export const getMaxAmount = async (account, network, voting, address) => {
  const balance = account.summary?.balance ?? 0;
  const totalUnconfirmedVotes = Object.values(voting)
    .filter(vote => vote.confirmed < vote.unconfirmed)
    .map(vote => vote.unconfirmed - vote.confirmed)
    .reduce((total, amount) => (total + amount), 0);

  const maxVoteAmount = Math.floor(
    (balance - totalUnconfirmedVotes - MIN_ACCOUNT_BALANCE) / 1e9,
  ) * 1e9;

  const transaction = {
    fee: 1e6,
    votes: normalizeVotesForTx({
      ...voting,
      [address]: {
        confirmed: voting[address] ? voting[address].confirmed : 0,
        unconfirmed: maxVoteAmount,
      },
    }),
    nonce: account.sequence?.nonce,
    senderPublicKey: account.summary?.publicKey,
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
  };

  const maxAmountFee = await getTransactionFee({
    token: 'LSK',
    account,
    network,
    transaction,
    selectedPriority: { title: 'Normal', value: 0, selectedIndex: 0 }, // Always set to LOW
    numberOfSignatures: getNumberOfSignatures(account),
  }, 'LSK');

  // If the "sum of vote amounts + fee + dust" exceeds balance
  // return 10 LSK less, since votes must be multiplications of 10 LSK.
  if ((maxVoteAmount + toRawLsk(maxAmountFee.value)) <= (
    balance - totalUnconfirmedVotes - MIN_ACCOUNT_BALANCE)) {
    return maxVoteAmount;
  }
  return maxVoteAmount - VOTE_AMOUNT_STEP;
};
