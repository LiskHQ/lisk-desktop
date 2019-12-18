import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { toRawLsk } from '../../../../../utils/lsk';
import * as btcTransactionsAPI from '../../../../../utils/api/btc/transactions';

const useDynamicFeeCalculation = (account) => {
  const {
    settings: { token: { active: token } },
    network: networkConfig,
  } = useSelector(state => state);
  const [unspentTransactionOutputs, setUnspentTransactionOutputs] = useState([]);
  useEffect(() => {
    btcTransactionsAPI
      .getUnspentTransactionOutputs(account.info[token].address, networkConfig)
      .then(data => setUnspentTransactionOutputs(data));
  }, []);

  const getCalculatedDynamicFee = (dynamicFeePerByte, txAmount) => (
    btcTransactionsAPI.getTransactionFeeFromUnspentOutputs({
      unspentTransactionOutputs,
      satoshiValue: toRawLsk(txAmount),
      dynamicFeePerByte,
    })
  );
  return getCalculatedDynamicFee;
};

export default useDynamicFeeCalculation;
