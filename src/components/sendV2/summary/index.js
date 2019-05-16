/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { transactionCreated, resetTransactionResult } from '../../../actions/transactions';
import Summary from './summary';

const mapStateToProps = state => ({
  account: state.account,
  failedTransactions: state.transactions.failed,
  pendingTransactions: state.transactions.pending,
  transactions: state.transactions,
});

const mapDispatchToProps = {
  transactionCreated,
  resetTransactionResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Summary));
