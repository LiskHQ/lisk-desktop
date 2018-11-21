import actionTypes from '../../constants/actions';

const secondPassphrase = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.secondPassphraseRegisteredFailure:
      return {
        ...state,
        error: action.text,
        step: 'second-passphrase-register-failure',
      };
    case actionTypes.secondPassphraseRegisteredFailureReset:
      return {
        ...state,
        error: false,
        step: false,
      };
    default:
      return state;
  }
};

export default secondPassphrase;
