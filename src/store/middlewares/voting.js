import { getDelegate } from '../../utils/api/delegate';
import { voteLookupStatusUpdated, voteToggled, votesFetched } from '../../actions/voting';
import actionTypes from '../../constants/actions';
import { loadDelegateCache } from '../../utils/delegates';

const updateLookupStatus = (store, list, username) => {
  store.dispatch(voteLookupStatusUpdated({
    username, status: list,
  }));
};

const lookupDelegate = (store, username) => {
  const state = store.getState();
  const liskAPIClient = state.peers.liskAPIClient;
  const localStorageDelegates = loadDelegateCache(state.peers);
  const delegate = localStorageDelegates[username]
    || state.voting.delegates.find(d => d.username === username);
  if (delegate) {
    return new Promise((resolve) => {
      resolve({ data: [delegate] });
    });
  }
  return getDelegate(liskAPIClient, { username });
};

const processVote = (store, options, username) => {
  updateLookupStatus(store, 'pending', username);
  lookupDelegate(store, username).then((response) => {
    const vote = store.getState().voting.votes[username];
    if (options.isValid(vote)) {
      store.dispatch(voteToggled({
        username,
        publicKey: response.data[0].account.publicKey,
        rank: response.data[0].rank,
        productivity: response.data[0].productivity,
      }));
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

const fetchVotes = (store) => {
  // TODO investigate if this function is needed here at all
  // or maybe it should be moved somewhere else (e.g. urlVotesFound action)
  const state = store.getState();
  const address = state.account.address;
  store.dispatch(votesFetched({
    address,
    type: 'update',
  }));
};

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.votesAdded:
      fetchVotes(store);
      lookupDelegatesFromUrl(store, action);
      break;
    default: break;
  }
};

export default votingMiddleware;
