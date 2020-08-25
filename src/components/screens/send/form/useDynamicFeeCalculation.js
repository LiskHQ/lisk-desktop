import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getDynamicFee,
} from '../../../../utils/api/transactions';

// eslint-disable-next-line max-statements
const useDynamicFeeCalculation = (dynamicFeePerByte, txData) => {
  const network = useSelector(state => state.network);
  const token = useSelector(state => state.settings.token.active);
  const account = useSelector(state => state.account.info[token]);


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

  const setDynamicFee = async (param, name) => {
    const res = await getDynamicFee(param);
    if (name === 'fee') setFee(res);
    else {
      setMaxAmount({
        ...res,
        value: account.balance - res.value,
      });
    }
  };

  useEffect(() => {
    setDynamicFee({
      token, account, network, txData, dynamicFeePerByte,
    }, 'fee');

    setDynamicFee({
      token, account, network, txData: { ...txData, amount: account.balance }, dynamicFeePerByte,
    }, 'maxAmount');
  }, [txData.amount, txData.data, txData.recipient, dynamicFeePerByte.selectedIndex]);

  return [fee, maxAmount];
};

export default useDynamicFeeCalculation;
