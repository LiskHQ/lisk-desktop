import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getTransactionFee,
} from '../../../../utils/api/transactions';
import { toRawLsk } from '../../../../utils/lsk';

const useTransactionFeeCalculation = ({
  selectedPriority, txData, token, account,
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

  const setFeeState = async (param, name) => {
    const res = await getTransactionFee(param);
    if (name === 'fee') setFee(res);
    else {
      setMaxAmount({
        ...res,
        value: account.balance - toRawLsk(res.value),
      });
    }
  };

  useEffect(() => {
    setFeeState({
      token, account, network, txData, selectedPriority,
    }, 'fee');

    setFeeState({
      token, account, network, txData: { ...txData, amount: account.balance }, selectedPriority,
    }, 'maxAmount');
  }, [txData.amount, txData.data, txData.recipient, selectedPriority.selectedIndex]);

  return [fee, maxAmount];
};

export default useTransactionFeeCalculation;
