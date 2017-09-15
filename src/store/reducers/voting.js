import actionTypes from '../../constants/actions';

/**
 * voting reducer
 *
 * @param {Object} state
 * @param {Object} action
 */
const voting = (state = { votes: {}, delegates: [], totalDelegates: 0 }, action) => {
  switch (action.type) {
    case actionTypes.votesAdded:
      return Object.assign({}, state, {
        votes: action.data.list
          .reduce((votesDict, delegate) => {
            votesDict[delegate.username] = {
              confirmed: true,
              unconfirmed: true,
              publicKey: delegate.publicKey,
            };
            return votesDict;
          }, {}),
        refresh: false,
      });

    case actionTypes.delegatesAdded:
      return Object.assign({}, state, {
        delegates: action.data.refresh ? action.data.list :
          [...state.delegates, ...action.data.list],
        totalDelegates: action.data.totalCount,
        refresh: true,
      });

    case actionTypes.voteToggled:
      return Object.assign({}, state, {
        refresh: false,
        votes: Object.assign({}, state.votes, {
          [action.data.username]: {
            confirmed: state.votes[action.data.username] ?
              state.votes[action.data.username].confirmed : false,
            unconfirmed: state.votes[action.data.username] ?
              !state.votes[action.data.username].unconfirmed : true,
            publicKey: action.data.publicKey,
          },
        }),
      });


    case actionTypes.accountLoggedOut:
      return Object.assign({}, state, {
        votes: {},
        delegates: [],
        refresh: true,
      });

    case actionTypes.votesCleared:
      return Object.assign({}, state, {
        votes: Object.keys(state.votes).reduce((votesDict, username) => {
          votesDict[username] = {
            confirmed: state.votes[username].confirmed,
            unconfirmed: state.votes[username].confirmed,
            publicKey: state.votes[username].publicKey,
            pending: false,
          };
          return votesDict;
        }, {}),
        refresh: true,
      });

    case actionTypes.pendingVotesAdded:
      return Object.assign({}, state, {
        refresh: false,
        votes: Object.keys(state.votes).reduce((votesDict, username) => {
          const pending = state.votes[username].confirmed !== state.votes[username].unconfirmed;
          const { confirmed, unconfirmed, publicKey } = state.votes[username];

          votesDict[username] = {
            confirmed: pending ? !confirmed : confirmed,
            unconfirmed,
            pending,
            publicKey,
          };
          return votesDict;
        }, {}),
      });

    default:
      return state;
  }
};

export default voting;
