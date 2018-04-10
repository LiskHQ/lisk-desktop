import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { settingsUpdated } from '../../actions/settings';

import {
  urlVotesFound,
  voteLookupStatusCleared,
} from '../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const filterObjectPropsWithValue = (object = {}, value) => (
  Object.keys(object).filter(key => object[key] === value)
);

const mapStateToProps = state => ({
  votes: state.voting.votes,
  urlVoteCount: Object.keys(state.voting.voteLookupStatus || {}).length,
  pending: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'pending'),
  unvotes: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'unvotes'),
  upvotes: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'upvotes'),
  alreadyVoted: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'alreadyVoted'),
  notVotedYet: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'notVotedYet'),
  notFound: filterObjectPropsWithValue(state.voting.voteLookupStatus, 'notFound'),
  account: state.account,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  urlVotesFound: data => dispatch(urlVotesFound(data)),
  settingsUpdated: data => dispatch(settingsUpdated(data)),
  clearVoteLookupStatus: () => dispatch(voteLookupStatusCleared()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    translate()(VoteUrlProcessor),
  ),
);
