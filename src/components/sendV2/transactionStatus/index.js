/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import TransactionStatus from './transactionStatus';
import { transactionBroadcasted, resetTransactionResult } from '../../../actions/transactions';
import { searchAccount } from '../../../actions/search';

const mapStateToProps = state => ({
  delegates: state.search.delegates || {},
  followedAccounts: state.followedAccounts ? state.followedAccounts.accounts : [],
  transactions: state.transactions,
});

const mapDispatchToProps = {
  resetTransactionResult,
  searchAccount,
  transactionBroadcasted,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TransactionStatus));
