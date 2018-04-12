import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { voteToggled, votesFetched, delegatesFetched } from '../../actions/voting';
import DelegateList from './delegateList';

const mapStateToProps = state => ({
  address: state.account.address,
  isDelegate: state.account.isDelegate,
  serverPublicKey: state.account.serverPublicKey,
  activePeer: state.peers.data,
  votes: state.voting.votes,
  delegates: state.voting.delegates,
  totalDelegates: state.voting.totalDelegates,
  refreshDelegates: state.voting.refresh,
});

const mapDispatchToProps = dispatch => ({
  voteToggled: data => dispatch(voteToggled(data)),
  votesFetched: data => dispatch(votesFetched(data)),
  delegatesFetched: data => dispatch(delegatesFetched(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(DelegateList));
