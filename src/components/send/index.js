import { connect } from 'react-redux';
import Send from './send';

const mapStateToProps = state => ({
  account: state.account,
  activePeer: state.peers.data,
});

export default connect(mapStateToProps)(Send);

