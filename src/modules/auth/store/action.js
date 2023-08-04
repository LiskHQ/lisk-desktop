/* eslint-disable max-lines */
import actionTypes from './actionTypes';

/** export const accountLoading = () => ({
  type: actionTypes.accountLoading,
}); */

export const secondPassphraseStored = (passphrase) => ({
  type: actionTypes.secondPassphraseStored,
  data: passphrase,
});

export const secondPassphraseRemoved = () => ({
  type: actionTypes.secondPassphraseRemoved,
});
