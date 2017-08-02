import { connect } from 'react-redux';
import VotingComponent from './votingComponent';
import {
          addToVoteList,
          removeFromVoteList,
       } from '../../actions/voting';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
});
const mapDispatchToProps = dispatch => ({
  addToVoteList: data => dispatch(addToVoteList(data)),
  removeFromVoteList: data => dispatch(removeFromVoteList(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VotingComponent);
