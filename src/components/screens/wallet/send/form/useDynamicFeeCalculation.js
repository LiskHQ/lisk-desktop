import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { fromRawLsk, toRawLsk } from '../../../../../utils/lsk';
import * as btcTransactionsAPI from '../../../../../utils/api/btc/transactions';

const useDynamicFeeCalculation = (account, dynamicFeePerByte) => {
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

  const getDynamicFee = txAmount => (
    btcTransactionsAPI.getTransactionFeeFromUnspentOutputs({
      unspentTransactionOutputs,
      satoshiValue: toRawLsk(txAmount),
      dynamicFeePerByte,
    })
  );

  const getMaxAmount = () => {
    const unspentTxOutsTotal = unspentTransactionOutputs.reduce((total, tx) => {
      total += tx.value;
      return total;
    }, 0);

    return fromRawLsk(Math.max(
      0,
      unspentTxOutsTotal - getDynamicFee(unspentTxOutsTotal),
    ));
  };

  return [getDynamicFee, getMaxAmount];
};

export default useDynamicFeeCalculation;
