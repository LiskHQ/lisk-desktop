import { connect } from 'react-redux';
import VotingComponent from './votingComponent';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
});
export default connect(mapStateToProps)(VotingComponent);
