// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getActiveTokenAccount } from '../../../utils/account';
import { loadTransactions } from '../../../actions/transactions';
import RecentTransactions from './recentTransactions';
import removeDuplicateTransactions from '../../../utils/transactions';


const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  settings: state.settings,
  transactions:
    removeDuplicateTransactions(
      state.transactions.pending,
      state.transactions.confirmed,
    ).slice(0, 5),
});

const mapDispatchToProps = {
  loadTransactions,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(RecentTransactions));
