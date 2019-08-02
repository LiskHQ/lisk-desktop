/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getLastTransaction, getTransactions } from '../../../actions/transactions';
import { updateAccountDelegateStats } from '../../../actions/account';
import WalletTransactions from './walletTransactions';
import txFilters from '../../../constants/transactionFilters';
import removeDuplicateTransactions from '../../../utils/transactions';
import { getActiveTokenAccount } from '../../../utils/account';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transaction: state.transaction,
  transactions:
    removeDuplicateTransactions(
      state.transactions.pending,
      state.transactions.confirmed,
    ),
  count: state.transactions.count,
  activeFilter: state.transactions.filters.direction || txFilters.all,
  filters: state.transactions.filters,
  loading: state.loading,
  bookmarks: state.bookmarks,
  wallets: state.wallets,
  balance: getActiveTokenAccount(state).balance,
});

const mapDispatchToProps = {
  getTransactions,
  getLastTransaction,
  updateAccountDelegateStats,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(WalletTransactions)));
