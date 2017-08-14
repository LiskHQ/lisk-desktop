import { connect } from 'react-redux';
import VotingHeader from './votingHeader';
import { dialogDisplayed } from '../../actions/dialog';
import { removedFromVoteList } from '../../actions/voting';
import { transactionAdded } from '../../actions/transactions';


const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  addToUnvoted: data => dispatch(removedFromVoteList(data)),
  addTransaction: data => dispatch(transactionAdded(data)),
});
const mapStateToProps = state => ({
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
});

export default connect(mapStateToProps, mapDispatchToProps)(VotingHeader);
