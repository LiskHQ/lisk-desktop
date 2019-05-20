// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { loadTransactions } from '../../actions/transactions';
import removeDuplicateTransactions from '../../utils/transactions';
import Dashboard from './dashboard';


const mapStateToProps = state => ({
  transactions: removeDuplicateTransactions(
    state.transactions.pending,
    state.transactions.confirmed,
  ),
  pendingTransactions: state.transactions.pending,
  account: state.account,
  loading: state.loading.length > 0,
  settings: state.settings,
});

const mapDispatchToProps = {
  loadTransactions,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Dashboard));
