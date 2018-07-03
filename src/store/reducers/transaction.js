import actionTypes from '../../constants/actions';

const transaction = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.transactionCleared:
      return {};
    case actionTypes.transactionLoaded:
      return {
        votesName: state.votesName || {},
        success: action.data.success,
        ...action.data,
      };
    case actionTypes.transactionLoadFailed:
      return action.data.error;
    case actionTypes.transactionAddDelegateName: {
      const { voteArrayName, delegate } = action.data;
      const arr = (state.votesName && state.votesName[voteArrayName]) || [];
      const value = [].concat(arr, delegate);
      return {
        ...state,
        votesName: {
          ...state.votesName,
          [voteArrayName]: value,
        },
      };
    }
    default:
      return state;
  }
};

export default transaction;
