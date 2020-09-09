import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getTransactionFee,
} from '../../../../utils/api/transactions';
import { toRawLsk } from '../../../../utils/lsk';

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
    const res = await getTransactionFee(param);
    if (name === 'fee') setFee(res);
    else if (name === 'maxAmount') {
      setMaxAmount({
        ...res,
        value: account.balance - toRawLsk(res.value),
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
    selectedPriority.selectedIndex,
    selectedPriority.value,
  ]);

  return { fee, maxAmount, minFee };
};

export default useTransactionFeeCalculation;
