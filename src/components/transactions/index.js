import { connect } from 'react-redux';
import Transactions from './transactionsComponent';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
});
export default connect(mapStateToProps)(Transactions);

