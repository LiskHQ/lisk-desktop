// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { transactionToJSON } from '@utils/transaction';
import { isEmpty } from '@utils/helpers';
import { withTranslation } from 'react-i18next';
import { transactionBroadcasted, resetTransactionResult } from '@actions';
import TransactionResult from './transactionResult';

/**
 * Defines the status of the broadcasted tx.
 *
 * @param {Object} transactions - Transactions status from the redux store
 * @returns {Object} The status code and message
 */
export const getBroadcastStatus = (transactions, isHardwareWalletError) => {
  if (!isEmpty(transactions.signedTransaction)) {
    return { code: 'pending' };
  }
  if (!transactions.txBroadcastError && !isHardwareWalletError) {
    return { code: 'success' };
  }
  return { code: 'error', message: transactionToJSON(transactions.txBroadcastError) };
};

const mapStateToProps = state => ({
  activeToken: state.settings.token.active,
  transactions: state.transactions,
  account: state.account,
});

const mapDispatchToProps = {
  transactionBroadcasted,
  resetTransactionResult,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(TransactionResult);
