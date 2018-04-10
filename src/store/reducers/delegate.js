import actionTypes from '../../constants/actions';

const delegate = (state = [], action) => {
  switch (action.type) {
    case actionTypes.delegatesRetrieved:
      return {
        delegateNameQueried: true,
        delegateNameInvalid: action.data.delegate !== undefined,
      };

    case actionTypes.transactionAdded:
      return {
        delegateRegisteredSuccess: action.data,
      };
    default:
      return state;
  }
};

export default delegate;
