// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import RecentTransactions from './recentTransactions';


const mapStateToProps = state => ({
  account: state.account,
  bookmarks: state.bookmarks,
  settings: state.settings,
  transactions: state.transactions,
});

export default connect(mapStateToProps)(translate()(RecentTransactions));
