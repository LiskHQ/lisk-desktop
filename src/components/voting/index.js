import { connect } from 'react-redux';
import { dialogDisplayed } from '../../actions/dialog';
import { voteToggled, votesFetched } from '../../actions/voting';
import { transactionAdded } from '../../actions/transactions';
import Voting from './voting';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  votes: state.voting.votes,
  delegates: state.voting.delegates,
  refreshDelegates: state.voting.refresh,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  voteToggled: data => dispatch(voteToggled(data)),
  addTransaction: data => dispatch(transactionAdded(data)),
  votesFetched: data => dispatch(votesFetched(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Voting);
