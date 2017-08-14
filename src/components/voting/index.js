import { connect } from 'react-redux';
import Voting from './voting';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
  refreshDelegates: state.voting.refresh,
});

export default connect(mapStateToProps)(Voting);
