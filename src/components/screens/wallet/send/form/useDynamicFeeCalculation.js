import { useSelector } from 'react-redux';
import usePromise from 'react-use-promise';
import { fromRawLsk, toRawLsk } from '../../../../../utils/lsk';
import {
  getTransactionFeeFromUnspentOutputs,
  getUnspentTransactionOutputs,
} from '../../../../../utils/api/btc/transactions';

const useDynamicFeeCalculation = (account, dynamicFeePerByte) => {
  const {
    settings: { token: { active: token } },
    network: networkConfig,
  } = useSelector(state => state);
  const [unspentTransactionOutputs = []] = usePromise(
    () => getUnspentTransactionOutputs(account.info[token].address, networkConfig),
    [account.info[token].address],
  );

  const getDynamicFee = txAmount => (
    getTransactionFeeFromUnspentOutputs({
      unspentTransactionOutputs,
      satoshiValue: toRawLsk(txAmount),
      dynamicFeePerByte,
    })
  );

  const getMaxAmount = () => {
    const unspentTxOutsTotal = unspentTransactionOutputs.reduce((total, tx) => {
      total += tx.value;
      return total;
    }, 0) || /* fallback before unspentTransactionOutputs are loaded */ account.info[token].balance;

    return fromRawLsk(Math.max(
      0,
      unspentTxOutsTotal - getDynamicFee(unspentTxOutsTotal),
    ));
  };

  return [getDynamicFee, getMaxAmount];
};

export default useDynamicFeeCalculation;
