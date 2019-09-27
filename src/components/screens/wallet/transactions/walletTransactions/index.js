/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getTransactions } from '../../../../../actions/transactions';
import WalletTransactions from './walletTransactions';
import txFilters from '../../../../../constants/transactionFilters';
import removeDuplicateTransactions from '../../../../../utils/transactions';
import { settingsUpdated } from '../../../../../actions/settings';
import { getActiveTokenAccount } from '../../../../../utils/account';

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
  isDiscreetMode: state.settings.discreetMode || false,
  settings: state.settings,
});

const mapDispatchToProps = {
  getTransactions,
  settingsUpdated,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(WalletTransactions)));
