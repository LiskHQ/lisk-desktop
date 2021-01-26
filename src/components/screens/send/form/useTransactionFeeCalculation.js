import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getTransactionFee,
} from '../../../../utils/api/transaction';
import { toRawLsk } from '../../../../utils/lsk';
import { tokenMap } from '../../../../constants/tokens';
import { minBalance } from '../../../../constants/transactions';

const calculateAvailableBalance = (balance, token) => {
  if (token !== tokenMap.LSK.key) return balance;
  if (balance <= minBalance) return balance;
  return balance - minBalance;
};

const useTransactionFeeCalculation = ({
  selectedPriority, txData, token, account, priorityOptions,
}) => {
  const network = useSelector(state => state.network);

  const initialFee = {
    value: 0,
    error: false,
    feedback: '',
  };
  const initialMaxAmount = {
    value: account.balance,
    error: false,
    feedback: '',
  };
  const [fee, setFee] = useState(initialFee);
  const [maxAmount, setMaxAmount] = useState(initialMaxAmount);
  const [minFee, setMinFee] = useState(initialFee);

  const setFeeState = async (param, name) => {
    const res = await getTransactionFee(param, token);
    if (name === 'fee') setFee(res);
    else if (name === 'maxAmount') {
      const availableBalance = calculateAvailableBalance(account.balance, token);
      setMaxAmount({
        ...res,
        value: availableBalance - toRawLsk(res.value),
      });
    } else {
      setMinFee(res);
    }
  };

  useEffect(() => {
    setFeeState({
      token, account, network, txData, selectedPriority,
    }, 'fee');

    setFeeState({
      token, account, network, txData: { ...txData, amount: account.balance }, selectedPriority,
    }, 'maxAmount');

    setFeeState({
      token,
      account,
      network,
      txData,
      selectedPriority: priorityOptions[0],
    }, 'minFee');
  }, [
    txData.amount,
    txData.data,
    txData.recipient,
    txData.username,
    selectedPriority.selectedIndex,
    selectedPriority.value,
  ]);

  return { fee, maxAmount, minFee };
};

export default useTransactionFeeCalculation;
