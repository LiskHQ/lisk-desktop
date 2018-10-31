import actionTypes from '../constants/actions';

export const secondPassphraseRegisteredFailure = data => ({
  type: actionTypes.secondPassphraseRegisteredFailure,
  text: data.text,
});

export const secondPassphraseRegisteredFailureReset = () => ({
  type: actionTypes.secondPassphraseRegisteredFailureReset,
});
