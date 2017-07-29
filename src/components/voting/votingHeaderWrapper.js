import { connect } from 'react-redux';
import VotingHeader from './votingHeader';
import { dialogDisplayed } from '../../actions/dialog';


const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
});
const mapStateToProps = state => ({
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
});

export default connect(mapStateToProps, mapDispatchToProps)(VotingHeader);
