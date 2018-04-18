import actionTypes from '../../constants/actions';

const transaction = (state = [], action) => {
  switch (action.type) {
    case actionTypes.transactionLoaded:
      return { success: action.data.success, ...action.data.transaction };
    case actionTypes.transactionLoadFailed:
      return action.data.error;
    case actionTypes.transactionAddDelegateName: {
      const votesName = state.votesName || { added: [], deleted: [] };
      return {
        ...state,
        votesName: {
          ...votesName,
          [action.arrName]: [].concat(votesName[action.arrName], action.delegate),
        },
      };
    }
    default:
      return state;
  }
};

export default transaction;
