/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { voteToggled, delegatesAdded } from '../../actions/voting';
import VotingListViewV2 from './votingListViewV2';

const mapStateToProps = state => ({
  account: state.account,
  address: state.account.address,
  isDelegate: state.account.isDelegate,
  votes: state.voting.votes,
  delegates: state.voting.delegates,
  totalDelegates: state.voting.totalDelegates,
  refreshDelegates: state.voting.refresh,
});

const mapDispatchToProps = {
  voteToggled,
  delegatesCleared: () => delegatesAdded({
    list: [], totalDelegates: 0, refresh: true,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(VotingListViewV2));
