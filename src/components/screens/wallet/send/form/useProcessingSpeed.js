import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { toRawLsk } from '../../../../../utils/lsk';
import * as btcTransactionsAPI from '../../../../../utils/api/btc/transactions';

const useProcessingSpeed = (account, dynamicFeesRetrieved) => {
  const {
    settings: { token: { active: token } },
    network: networkConfig,
  } = useSelector(state => state);

  const [unspentTransactionOutputs, setUnspentTransactionOutputs] = useState([]);
  const [processingSpeedState, setProcessingSpeedState] = useState({
    value: 0,
    isLoading: true,
    txFee: 0,
    selectedIndex: 0,
  });

  useEffect(() => {
    dynamicFeesRetrieved();
    btcTransactionsAPI
      .getUnspentTransactionOutputs(account.info[token].address, networkConfig)
      .then(data => setUnspentTransactionOutputs(data));
  }, []);

  const getCalculatedDynamicFee = (dynamicFeePerByte, amount) => (
    btcTransactionsAPI.getTransactionFeeFromUnspentOutputs({
      unspentTransactionOutputs,
      satoshiValue: toRawLsk(amount.value),
      dynamicFeePerByte,
    })
  );

  const selectProcessingSpeed = ({ item, index }, amount) => {
    setProcessingSpeedState({
      ...processingSpeedState,
      ...item,
      selectedIndex: index,
      isLoading: false,
      txFee: getCalculatedDynamicFee(item.value, amount),
    });
  };

  return [processingSpeedState, selectProcessingSpeed];
};

export default useProcessingSpeed;
