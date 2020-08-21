import { useSelector } from 'react-redux';
import {
  getDynamicFee,
} from '../../../../utils/api/transactions';

const useDynamicFeeCalculation = async (dynamicFeePerByte, txData) => {
  const network = useSelector(state => state.network);
  const token = useSelector(state => state.settings.token.active);
  const account = useSelector(state => state.account[token]);

  const fee = await getDynamicFee(account, network, txData, dynamicFeePerByte);
  const maxAmount = await getDynamicFee(
    account, network, { ...txData, amount: account.balance }, dynamicFeePerByte,
  );
  return [fee, maxAmount];
};

export default useDynamicFeeCalculation;
