import { withTranslation } from 'react-i18next';
import TransactionPriority from './TransactionPriority';
import useTransactionFeeCalculation from '../../hooks/useTransactionFeeCalculation';
import { normalizeVotesForTx } from '../../utils';
import useTransactionPriority from '../../hooks/useTransactionPriority';

export {
  useTransactionPriority,
  useTransactionFeeCalculation,
  normalizeVotesForTx,
};
export default withTranslation()(TransactionPriority);
