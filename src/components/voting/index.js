import { connect } from 'react-redux';
import VotingComponent from './votingComponent';
import {
          addToVotedList,
          removeFromVotedList,
          addToUnvotedList,
          removeFromUnvotedList,
       } from '../../actions/voting';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
});
const mapDispatchToProps = dispatch => ({
  addToVoted: data => dispatch(addToVotedList(data)),
  removeFromVoted: data => dispatch(removeFromVotedList(data)),
  addToUnvoted: data => dispatch(addToUnvotedList(data)),
  removeFromUnvoted: data => dispatch(removeFromUnvotedList(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VotingComponent);
