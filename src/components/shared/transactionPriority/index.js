import { withTranslation } from 'react-i18next';
import TransactionPriority from './transactionPriority';
import useTransactionFeeCalculation, {
  normalizeVotesForTx,
  getNumberOfSignatures,
} from './useTransactionFeeCalculation';
import useTransactionPriority from './useTransactionPriority';

export {
  useTransactionPriority,
  useTransactionFeeCalculation,
  normalizeVotesForTx,
  getNumberOfSignatures,
};
export default withTranslation()(TransactionPriority);
