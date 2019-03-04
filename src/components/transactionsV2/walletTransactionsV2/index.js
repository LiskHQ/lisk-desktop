/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { loadLastTransaction, transactionsRequested, transactionsFilterSet } from '../../../actions/transactions';
import WalletTransactionsV2 from './walletTransactionsV2';
import actionTypes from '../../../constants/actions';
import txFilters from './../../../constants/transactionFilters';
import removeDuplicateTransactions from '../../../utils/transactions';

const mapStateToProps = state => ({
  account: state.account,
  transaction: state.transaction,
  transactions:
    removeDuplicateTransactions(
      state.transactions.pending,
      state.transactions.confirmed,
    ),
  count: state.transactions.count,
  activeFilter: state.filters.wallet || txFilters.all,
  loading: state.loading,
  followedAccounts: state.followedAccounts.accounts,
  wallets: state.wallets,
  peers: state.peers,
});

const mapDispatchToProps = {
  transactionsRequested,
  transactionsFilterSet,
  loadLastTransaction,
  addFilter: data => ({ type: actionTypes.addFilter, data }),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(WalletTransactionsV2)));
