import { useSelector } from 'react-redux';
import { useEffect, useReducer } from 'react';
import { getTransactionFee } from '@common/utilities/api/transaction';
import { getNumberOfSignatures } from '@common/utilities/transaction';
import { actionTypes, reducer, getInitialState } from './reducer';

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

/**
 * Custom hook to define tx fee
 *
 * @param {object} data
 * @param {string} data.token - Option of LSK and BTC
 * @param {object} data.account - Active account info
 * @param {object} data.selectedPriority - Selected priority info
 * @param {object} data.transaction - Raw transaction payload
 * @param {array} data.priorityOptions - Array of priority configs for High, Mid, Low
 * @returns {object}
 */
const useTransactionFeeCalculation = ({
  token, account, selectedPriority, transaction, priorityOptions,
}) => {
  const network = useSelector(state => state.network);
  const [state, dispatch] = useReducer(reducer, account, getInitialState);

  const calculateTransactionFees = async (params) => {
    const fee = await getTransactionFee(params, token);
    dispatch({ type: actionTypes.setFee, payload: { response: fee, account, token } });

    const minFee = await getTransactionFee({
      ...params,
      selectedPriority: priorityOptions[0],
    }, token);

    dispatch({ type: actionTypes.setMinFee, payload: { response: minFee, account, token } });

    const maxAmountFee = await getTransactionFee({
      ...params,
      transaction: { ...params.transaction, amount: account.token?.balance },
    }, token);

    dispatch({
      type: actionTypes.setMaxAmount,
      payload: { response: maxAmountFee, account, token },
    });
  };

  useEffect(() => {
    calculateTransactionFees({
      token,
      account,
      network,
      transaction,
      selectedPriority,
      numberOfSignatures: getNumberOfSignatures(account, transaction),
    });
  }, [
    transaction.amount,
    transaction.data,
    transaction.recipientAddress,
    transaction.username,
    selectedPriority.selectedIndex,
    selectedPriority.value,
    transaction.mandatoryKeys,
    transaction.optionalKeys,
  ]);

  return state;
};

export default useTransactionFeeCalculation;
