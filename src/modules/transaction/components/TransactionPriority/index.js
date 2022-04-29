import { withTranslation } from 'react-i18next';
import TransactionPriority from './TransactionPriority';
import useTransactionFeeCalculation, { normalizeVotesForTx } from '../../hooks/useTransactionFeeCalculation';
import useTransactionPriority from '../../hooks/useTransactionPriority';

export {
  useTransactionPriority,
  useTransactionFeeCalculation,
  normalizeVotesForTx,
};
export default withTranslation()(TransactionPriority);
