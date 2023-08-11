import actionTypes from './actionTypes';

export const secondPassphraseStored = (passphrase) => ({
  type: actionTypes.secondPassphraseStored,
  data: passphrase,
});

export const secondPassphraseRemoved = () => ({
  type: actionTypes.secondPassphraseRemoved,
});
