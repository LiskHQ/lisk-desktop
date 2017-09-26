import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import { voteToggled, votesFetched, delegatesFetched } from '../../actions/voting';
import Voting from './voting';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  votes: state.voting.votes,
  delegates: state.voting.delegates,
  totalDelegates: state.voting.totalDelegates,
  refreshDelegates: state.voting.refresh,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  voteToggled: data => dispatch(voteToggled(data)),
  votesFetched: data => dispatch(votesFetched(data)),
  delegatesFetched: data => dispatch(delegatesFetched(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Voting));
