// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getTransactions } from '../../actions/transactions';
import removeDuplicateTransactions from '../../utils/transactions';
import { getActiveTokenAccount } from '../../utils/account';
import Dashboard from './dashboard';

const mapStateToProps = state => ({
  transactions: removeDuplicateTransactions(
    state.transactions.pending,
    state.transactions.confirmed,
  ),
  pendingTransactions: state.transactions.pending,
  account: getActiveTokenAccount(state),
  loading: state.loading.length > 0,
  settings: state.settings,
});

const mapDispatchToProps = {
  getTransactions,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Dashboard));
