import { withTranslation } from 'react-i18next';
import TransactionPriority from './transactionPriority';
import useTransactionFeeCalculation from './useTransactionFeeCalculation';
import useTransactionPriority from './useTransactionPriority';

export { useTransactionPriority, useTransactionFeeCalculation };
export default withTranslation()(TransactionPriority);
