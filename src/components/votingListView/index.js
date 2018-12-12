import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { voteToggled, votesFetched, delegatesFetched, delegatesAdded } from '../../actions/voting';
import VotingListView from './votingListView';

const mapStateToProps = state => ({
  account: state.account,
  address: state.account.address,
  isDelegate: state.account.isDelegate,
  serverPublicKey: state.account.serverPublicKey,
  votes: state.voting.votes,
  delegates: state.voting.delegates,
  totalDelegates: state.voting.totalDelegates,
  refreshDelegates: state.voting.refresh,
});

const mapDispatchToProps = dispatch => ({
  voteToggled: data => dispatch(voteToggled(data)),
  votesFetched: data => dispatch(votesFetched(data)),
  delegatesFetched: data => dispatch(delegatesFetched(data)),
  delegatesCleared: () => dispatch(delegatesAdded({
    list: [], totalDelegates: 0, refresh: true,
  })),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(VotingListView));
