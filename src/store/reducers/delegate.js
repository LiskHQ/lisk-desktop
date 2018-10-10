import actionTypes from '../../constants/actions';

const delegate = (state = [], action) => {
  let targetState = { ...state };
  switch (action.type) {
    case actionTypes.delegateRetrieving:
      return {
        ...state,
        delegateNameQueried: true,
      };
    case actionTypes.delegateRetrieved:
      return {
        ...state,
        delegateNameQueried: false,
        delegateNameInvalid: action.data.delegate !== null,
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
        registerError: action.data,
      };
    default:
      return state;
  }
};

export default delegate;
