/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import TransactionStatus from './transactionStatus';
import actionTypes from '../../../constants/actions';
import { searchAccount } from '../../../actions/search';

const mapStateToProps = state => ({
  failedTransactions: state.transactions.failed,
  followedAccounts: state.followedAccounts ? state.followedAccounts.accounts : [],
  delegates: state.search.delegates || {},
});

const mapDispatchToProps = {
  transactionFailedClear: () => ({
    type: actionTypes.transactionFailedClear,
  }),
  searchAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TransactionStatus));
