import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [unspentTransactionOutputs = []] = usePromise(
    () => getUnspentTransactionOutputs(account.info[token].address, networkConfig),
    [account.info[token].address],
  );

  const getDynamicFee = (txAmount) => {
    const value = getTransactionFeeFromUnspentOutputs({
      unspentTransactionOutputs,
      satoshiValue: toRawLsk(txAmount),
      dynamicFeePerByte,
    });
    const feedback = txAmount === ''
      ? '-'
      : `${(value ? '' : t('Invalid amount'))}`;
    return {
      value,
      error: !!feedback,
      feedback,
    };
  };

  const getMaxAmount = () => {
    const unspentTxOutsTotal = unspentTransactionOutputs.reduce((total, tx) => {
      total += tx.value;
      return total;
    }, 0) /* fallback before unspentTransactionOutputs are loaded */
    || /* istanbul ignore next */ account.info[token].balance;

    return fromRawLsk(Math.max(
      0,
      unspentTxOutsTotal - getDynamicFee(fromRawLsk(unspentTxOutsTotal)).value,
    ));
  };

  return [getDynamicFee, getMaxAmount];
};

export default useDynamicFeeCalculation;
