import i18next from 'i18next';

import { errorToastDisplayed } from '../../actions/toaster';
import { getDelegate } from '../../utils/api/delegate';
import { voteLookupStatusUpdated, voteToggled } from '../../actions/voting';
import actionTypes from '../../constants/actions';
import votingConst from '../../constants/voting';
import { getTotalVotesCount } from './../../utils/voting';

const updateLookupStatus = (store, list, username) => {
  store.dispatch(voteLookupStatusUpdated({
    username, status: list,
  }));
};

const lookupDelegate = (store, username) => {
  const state = store.getState();
  const activePeer = state.peers.data;
  const delegate = state.voting.delegates.filter(d => d.username === username)[0];
  if (delegate) {
    return new Promise((resolve) => {
      resolve({ delegate });
    });
  }
  return getDelegate(activePeer, { username });
};

const processVote = (store, options, username) => {
  updateLookupStatus(store, 'pending', username);
  lookupDelegate(store, username).then((data) => {
    const vote = store.getState().voting.votes[username];
    if (options.isValid(vote)) {
      store.dispatch(voteToggled({ username, publicKey: data.delegate.publicKey }));
      updateLookupStatus(store, options.successState, username);
    } else {
      updateLookupStatus(store, options.invalidState, username);
    }
  }).catch(() => {
    updateLookupStatus(store, 'notFound', username);
  });
};

const lookupDelegatesFromUrl = (store, action) => {
  const { upvotes, unvotes } = action.data;
  if (upvotes && unvotes) {
    unvotes.forEach(processVote.bind(this, store, {
      successState: 'unvotes',
      invalidState: 'notVotedYet',
      isValid: vote => (vote && vote.confirmed && vote.unconfirmed),
    }));
    upvotes.forEach(processVote.bind(this, store, {
      successState: 'upvotes',
      invalidState: 'alreadyVoted',
      isValid: vote => (!vote || (!vote.confirmed && !vote.unconfirmed)),
    }));
  }
};

const checkVoteLimits = (store, action) => {
  const { votes } = store.getState().voting;
  const currentVote = votes[action.data.username] || { unconfirmed: true, confirmed: false };

  const newVoteCount = Object.keys(votes).filter(
    key => votes[key].confirmed !== votes[key].unconfirmed).length;
  if (newVoteCount === votingConst.maxCountOfVotesInOneTurn + 1 &&
        currentVote.unconfirmed !== currentVote.confirmed) {
    const label = i18next.t('Maximum of {{n}} votes in one transaction exceeded.', { n: votingConst.maxCountOfVotesInOneTurn });
    const newAction = errorToastDisplayed({ label });
    store.dispatch(newAction);
  }

  const voteCount = getTotalVotesCount(votes);
  if (voteCount === votingConst.maxCountOfVotes + 1 &&
        currentVote.unconfirmed !== currentVote.confirmed) {
    const label = i18next.t('Maximum of {{n}} votes exceeded.', { n: votingConst.maxCountOfVotes });
    const newAction = errorToastDisplayed({ label });
    store.dispatch(newAction);
  }
};

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.voteToggled:
      checkVoteLimits(store, action);
      break;
    case actionTypes.votesAdded:
      lookupDelegatesFromUrl(store, action);
      break;
    default: break;
  }
};

export default votingMiddleware;
