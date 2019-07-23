/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import {
  loadDelegates,
  loadVotes,
  voteLookupStatusCleared,
  voteToggled,
} from '../../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const mapDispatchToProps = {
  voteLookupStatusCleared,
  voteToggled,
  loadVotes,
  loadDelegates,
};

const mapStateToProps = state => ({
  delegates: state.voting.delegates,
  liskAPIClient: state.peers.liskAPIClient,
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(VoteUrlProcessor)));
