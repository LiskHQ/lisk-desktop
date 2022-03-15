import { withTranslation } from 'react-i18next';
import TransactionPriority from './transactionPriority';
import useTransactionFeeCalculation, { normalizeVotesForTx } from './useTransactionFeeCalculation';
import useTransactionPriority from './useTransactionPriority';

export {
  useTransactionPriority,
  useTransactionFeeCalculation,
  normalizeVotesForTx,
};
export default withTranslation()(TransactionPriority);
