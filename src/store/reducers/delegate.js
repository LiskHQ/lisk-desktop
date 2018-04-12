import actionTypes from '../../constants/actions';

const delegate = (state = [], action) => {
  let targetState = { ...state };
  switch (action.type) {
    case actionTypes.delegatesRetrieved:
      return {
        ...state,
        delegateNameQueried: true,
        delegateNameInvalid: action.data.delegate !== undefined,
        delegateName: action.data.username,
      };

    case actionTypes.accountUpdated:
      if (action.data.delegate && action.data.isDelegate) {
        targetState = {
          ...targetState,
          registerStep: 'register-success',
        };
      }
      return targetState;
    case actionTypes.delegateRegisteredFailure:
      return {
        ...state,
        registerStep: 'register-failure',
        registerError: action.data.error,
      };
    default:
      return state;
  }
};

export default delegate;
