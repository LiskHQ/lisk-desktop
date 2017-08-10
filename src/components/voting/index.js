import { connect } from 'react-redux';
import VotingComponent from './votingComponent';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
  refreshDelegates: state.voting.refresh,
});

export default connect(mapStateToProps)(VotingComponent);
