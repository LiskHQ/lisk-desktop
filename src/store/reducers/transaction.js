import actionTypes from '../../constants/actions';

const transaction = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.transactionInit:
      return {};
    case actionTypes.transactionLoaded:
      return { success: action.data.success, ...action.data.transaction };
    case actionTypes.transactionLoadFailed:
      return action.data.error;
    case actionTypes.transactionAddDelegateName: {
      const arr = (state.votesName && state.votesName[action.arrName]) || [];
      const value = [].concat(arr, action.delegate);
      return {
        ...state,
        votesName: {
          ...state.votesName,
          [action.arrName]: value,
        },
      };
    }
    default:
      return state;
  }
};

export default transaction;
