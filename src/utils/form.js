export const passphraseIsValid = passphrase => (!passphrase.error && passphrase.value !== '');

export default {
  passphraseIsValid,
};
