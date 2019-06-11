/* istanbul ignore file */
import { connect } from 'react-redux';
import { loadSingleTransaction } from '../../actions/transactions';
import SingleTransactionV2 from './singleTransactionV2';

const mapStateToProps = state => ({
  address: state.account.address,
  transaction: state.transaction,
  peers: state.peers,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
});

const mapDispatchToProps = {
  loadSingleTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleTransactionV2);
