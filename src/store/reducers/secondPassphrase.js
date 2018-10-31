import actionTypes from '../../constants/actions';

const secondPassphrase = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.secondPassphraseRegisteredFailure: {
      const newState = {
        ...state,
        secondPassphraseStep: 'second-passphrase-register-failure',
      };
      return newState;
    }
    default:
      return state;
  }
};

export default secondPassphrase;
