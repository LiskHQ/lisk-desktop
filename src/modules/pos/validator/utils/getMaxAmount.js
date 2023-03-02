import { getTransactionFee } from '@transaction/api';
import { getNumberOfSignatures } from '@transaction/utils/transaction';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { MIN_ACCOUNT_BALANCE, STAKE_AMOUNT_STEP } from '@transaction/configuration/transactions';
import { convertToBaseDenom } from '@token/fungible/utils/lsk';
import { normalizeStakesForTx, splitModuleAndCommand } from '@transaction/utils';

/**
 * Calculates the maximum stake amount possible. It
 * Takes the current stakes, minimum account balance and
 * transaction fee into account.
 *
 * @param {object} account - Lisk account info from the Redux store
 * @param {object} address - Raw transaction object @todo fix description
 * @param {object} staking - List of stakes from the Redux store
 * @returns {Number} - Maximum possible stake amount
 */
const getMaxAmount = async ({
  balance,
  nonce,
  publicKey,
  staking,
  address,
  numberOfSignatures,
  mandatoryKeys,
  optionalKeys,
  moduleCommandSchemas,
  token,
}) => {
  const totalUnconfirmedStakes = Object.values(staking)
    .filter((stake) => stake.confirmed < stake.unconfirmed)
    .map((stake) => stake.unconfirmed - stake.confirmed)
    .reduce((total, amount) => total + amount, 0);
  const currentStake = staking[address] ? staking[address].confirmed : 0;
  const isMultisignature = !optionalKeys.length && !mandatoryKeys.length;

  const maxStakeAmount =
    Math.floor((balance - (totalUnconfirmedStakes + currentStake + MIN_ACCOUNT_BALANCE)) / 1e9) *
    1e9;

  // TODO: Refactor this logic, max amount can be calculated without constructing trx
  const { module, command } = splitModuleAndCommand(MODULE_COMMANDS_NAME_MAP.stake);
  const transaction = {
    fee: 1e6,
    nonce,
    params: {
      stakes: normalizeStakesForTx({
        ...staking,
        [address]: {
          confirmed: staking[address] ? staking[address].confirmed : 0,
          unconfirmed: maxStakeAmount,
        },
      }),
    },
    sender: {
      publicKey,
    },
    module,
    command,
  };

  const maxAmountFee = await getTransactionFee({
    transactionJSON: transaction,
    /* @Todo: this needs to be refactored in the feature but for now it works */
    selectedPriority: { title: 'Normal', value: 0, selectedIndex: 0 }, // Always set to LOW
    numberOfSignatures: getNumberOfSignatures(
      { keys: { numberOfSignatures }, summary: { isMultisignature } },
      transaction
    ),
    moduleCommandSchemas,
    token,
  });

  // If the "sum of stake amounts + fee + dust" exceeds balance
  // return 10 LSK less, since stakes must be multiplications of 10 LSK.
  if (
    maxStakeAmount + convertToBaseDenom(maxAmountFee.value, token) <=
    balance - totalUnconfirmedStakes + currentStake - MIN_ACCOUNT_BALANCE
  ) {
    return maxStakeAmount;
  }
  return maxStakeAmount - STAKE_AMOUNT_STEP;
};

export default getMaxAmount;
