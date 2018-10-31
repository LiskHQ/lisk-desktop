import actionTypes from '../../constants/actions';

const secondPassphrase = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.secondPassphraseRegisteredFailure:
      return {
        ...state,
        secondPassphraseStep: 'second-passphrase-register-failure',
      };
    case actionTypes.secondPassphraseRegisteredFailureReset:
      return {
        ...state,
        secondPassphraseStep: false,
      };
    default:
      return state;
  }
};

export default secondPassphrase;
