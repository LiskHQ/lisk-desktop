import actionTypes from '../../constants/actions';

const delegate = (state = [], action) => {
  let targetState = { ...state };
  switch (action.type) {
    case actionTypes.delegatesRetrieving:
      console.log('delegatesRetrieving', targetState);
      return {
        ...state,
        delegateNameQueried: true,
      };
    case actionTypes.delegatesRetrieved:
      console.log('delegatesRetrieved', targetState);
      console.log('action.data.delegate === undefined', action.data.delegate === undefined);
      return {
        ...state,
        delegateNameQueried: false,
        delegateNameInvalid: action.data.delegate === undefined,
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
