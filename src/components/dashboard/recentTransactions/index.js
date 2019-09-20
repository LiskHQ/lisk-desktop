// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '../../../utils/account';
import { getTransactions } from '../../../actions/transactions';
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
  getTransactions,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RecentTransactions));
