import { connect } from 'react-redux';
import { dialogDisplayed } from '../../actions/dialog';
import { removedFromVoteList, addedToVoteList } from '../../actions/voting';
import { transactionAdded } from '../../actions/transactions';
import Voting from './voting';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
  refreshDelegates: state.voting.refresh,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  addToUnvoted: data => dispatch(addedToVoteList(data)),
  addToVoteList: data => dispatch(addedToVoteList(data)),
  removeFromVoteList: data => dispatch(removedFromVoteList(data)),
  addTransaction: data => dispatch(transactionAdded(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Voting);
