import { connect } from 'react-redux';
import { translate } from 'react-i18next';
// import { withRouter } from 'react-router-dom';
import { loadTransaction } from '../../../actions/transactions';
import TransactionDetailView from './transactionDetailView';

const mapStateToProps = state => ({
  peers: state.peers,
});

const mapDispatchToProps = {
  loadTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TransactionDetailView));
