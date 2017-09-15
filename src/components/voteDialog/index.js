import { connect } from 'react-redux';
import { votePlaced, voteToggled } from '../../actions/voting';
import { transactionAdded } from '../../actions/transactions';
import VoteDialog from './voteDialog';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  delegates: state.voting.delegates,
  account: state.account,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  votePlaced: data => dispatch(votePlaced(data)),
  voteToggled: data => dispatch(voteToggled(data)),
  addTransaction: data => dispatch(transactionAdded(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VoteDialog);
