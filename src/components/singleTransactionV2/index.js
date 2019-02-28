/* istanbul ignore file */
import { connect } from 'react-redux';
import { loadTransaction } from '../../actions/transactions';
import SingleTransactionV2 from './singleTransactionV2';

const mapStateToProps = state => ({
  address: state.account.address,
  transaction: state.transaction,
  peers: state.peers,
});

const mapDispatchToProps = {
  loadTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleTransactionV2);
