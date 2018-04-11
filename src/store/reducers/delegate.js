import actionTypes from '../../constants/actions';

const delegate = (state = [], action) => {
  switch (action.type) {
    case actionTypes.delegatesRetrieved:
      return {
        ...state,
        delegateNameQueried: true,
        delegateNameInvalid: action.data.delegate !== undefined,
      };

    case actionTypes.delegateRegisteredSuccess:
      return {
        ...state,
        registerStep: 'register-success',
      };

    case actionTypes.delegateRegisteredFailure:
      return {
        ...state,
        registerStep: 'register-failure',
      };
    default:
      return state;
  }
};

export default delegate;
