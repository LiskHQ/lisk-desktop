import { getTransactionFee } from '@transaction/api';
import { getNumberOfSignatures } from '@transaction/utils/transaction';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { MIN_ACCOUNT_BALANCE, VOTE_AMOUNT_STEP } from '@transaction/configuration/transactions';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { normalizeVotesForTx } from '@transaction/utils';

/**
 * Calculates the maximum vote amount possible. It
 * Takes the current votes, minimum account balance and
 * transaction fee into account.
 *
 * @param {object} account - Lisk account info from the Redux store
 * @param {object} network - Network info from the Redux store
 * @param {object} address - Raw transaction object @todo fix description
 * @param {object} voting - List of votes from the Redux store
 * @returns {Number} - Maximum possible vote amount
 */
const getMaxAmount = async ({
  balance,
  nonce,
  publicKey,
  voting,
  address,
  network,
  numberOfSignatures,
  mandatoryKeys,
  optionalKeys,
}) => {
  const totalUnconfirmedVotes = Object.values(voting)
    .filter((vote) => vote.confirmed < vote.unconfirmed)
    .map((vote) => vote.unconfirmed - vote.confirmed)
    .reduce((total, amount) => total + amount, 0);
  const currentVote = voting[address] ? voting[address].confirmed : 0;
  const isMultisignature = !optionalKeys.length && !mandatoryKeys.length;

  const maxVoteAmount =
    Math.floor((balance - (totalUnconfirmedVotes + currentVote + MIN_ACCOUNT_BALANCE)) / 1e9) * 1e9;

  const transaction = {
    fee: 1e6,
    nonce,
    params: {
      votes: normalizeVotesForTx({
        ...voting,
        [address]: {
          confirmed: voting[address] ? voting[address].confirmed : 0,
          unconfirmed: maxVoteAmount,
        },
      }),
    },
    sender: {
      publicKey,
    },
    moduleCommand: MODULE_COMMANDS_NAME_MAP.voteDelegate,
  };

  const maxAmountFee = await getTransactionFee(
    {
      network,
      transaction,
      /* @Todo: the token symbol should be dynamically integrated from the useDposConstnats query hook which would be addressed in issue #4502 */
      token: 'LSK',
      wallet: {
        summary: { isMultisignature },
        keys: { members: [...optionalKeys, ...mandatoryKeys] },
      },
      /* @Todo: this needs to be refactored in the feature but for now it works */
      selectedPriority: { title: 'Normal', value: 0, selectedIndex: 0 }, // Always set to LOW
      numberOfSignatures: getNumberOfSignatures(
        { numberOfSignatures, isMultisignature },
        transaction
      ),
    },
    /* @Todo: the token symbol should be dynamically integrated from the useDposConstnats query hook which would be addressed in issue #4502 */
    'LSK'
  );

  // If the "sum of vote amounts + fee + dust" exceeds balance
  // return 10 LSK less, since votes must be multiplications of 10 LSK.
  if (
    maxVoteAmount + toRawLsk(maxAmountFee.value) <=
    balance - totalUnconfirmedVotes + currentVote - MIN_ACCOUNT_BALANCE
  ) {
    return maxVoteAmount;
  }
  return maxVoteAmount - VOTE_AMOUNT_STEP;
};

export default getMaxAmount;
