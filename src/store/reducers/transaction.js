// TODO delete/remove this file once SingleTransaction component use
// HOC for retrive the same data. All actions and reducer related TRANSACTION
// will be remove
import actionTypes from '../../constants/actions';

const transaction = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.transactionCleared:
      return {};
    case actionTypes.getTransactionSuccess:
      return {
        votesName: state.votesName || {},
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
