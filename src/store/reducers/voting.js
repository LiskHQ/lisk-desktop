import actionTypes from '../../constants/actions';

/**
 * voting reducer
 *
 * @param {Object} state
 * @param {Object} action
 */
const voting = (state = { votes: {}, delegates: [] }, action) => {
  switch (action.type) {
    case actionTypes.votesAdded:
      return Object.assign({}, state, {
        votes: action.data.list
          .reduce((votesDict, delegate) => {
            votesDict[delegate.username] = { confirmed: true, unconfirmed: true };
            return votesDict;
          }, {}),
        delegates: action.data.list,
      });

    case actionTypes.delegatesAdded:
      return Object.assign({}, state, {
        delegates: action.data.list,
      });

    case actionTypes.voteToggled:
      return Object.assign({}, state, {
        votes: Object.assign({}, state.votes, {
          [action.data]: {
            confirmed: state.votes[action.data] ? state.votes[action.data].confirmed : false,
            unconfirmed: state.votes[action.data] ? !state.votes[action.data].confirmed : true,
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
            pending: false,
          };
          return votesDict;
        }, {}),
        refresh: true,
      });

    case actionTypes.pendingVotesAdded:
      return Object.assign({}, state, {
        votes: Object.keys(state.votes).reduce((votesDict, username) => {
          const pending = state.votes[username].confirmed !== state.votes[username].unconfirmed;
          const { confirmed, unconfirmed } = state.votes[username];

          votesDict[username] = {
            confirmed: pending ? !confirmed : confirmed,
            unconfirmed,
            pending,
          };
          return votesDict;
        }, {}),
      });

    default:
      return state;
  }
};

export default voting;
