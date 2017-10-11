import i18next from 'i18next';

import { errorToastDisplayed } from '../../actions/toaster';
import { getDelegate } from '../../utils/api/delegate';
import { voteLookupStatusUpdated, voteToggled } from '../../actions/voting';
import actionTypes from '../../constants/actions';
import votingConst from '../../constants/voting';

const updateLookupStatus = (store, list, username) => {
  store.dispatch(voteLookupStatusUpdated({
    username, status: list,
  }));
};


const processUpvote = (store, activePeer, username) => {
  updateLookupStatus(store, 'pending', username);
  getDelegate(activePeer, { username }).then((data) => {
    const vote = store.getState().voting.votes[username];
    if (!vote || (!vote.confirmed && !vote.unconfirmed)) {
      store.dispatch(voteToggled({ username, publicKey: data.delegate.publicKey }));
      updateLookupStatus(store, 'upvotes', username);
    } else {
      updateLookupStatus(store, 'alreadyVoted', username);
    }
  }).catch(() => {
    updateLookupStatus(store, 'notFound', username);
  });
};

const processDownvote = (store, activePeer, username) => {
  updateLookupStatus(store, 'pending', username);
  getDelegate(activePeer, { username }).then((data) => {
    const vote = store.getState().voting.votes[username];
    if (vote && vote.confirmed && vote.unconfirmed) {
      store.dispatch(voteToggled({ username, publicKey: data.delegate.publicKey }));
      updateLookupStatus(store, 'downvotes', username);
    } else {
      updateLookupStatus(store, 'notVotedYet', username);
    }
  }).catch(() => {
    updateLookupStatus(store, 'notFound', username);
  });
};

const lookupDelegatesFromUrl = (store, action) => {
  const { upvotes, downvotes } = action.data;
  if (upvotes && downvotes) {
    const activePeer = store.getState().peers.data;
    downvotes.forEach(processDownvote.bind(this, store, activePeer));
    upvotes.forEach(processUpvote.bind(this, store, activePeer));
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

  const voteCount = Object.keys(votes).filter(
    key => (votes[key].confirmed && !votes[key].unconfirmed) || votes[key].unconfirmed).length;
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
