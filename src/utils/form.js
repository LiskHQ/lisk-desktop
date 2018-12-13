
export const authStatePrefill = account => ({
  secondPassphrase: {
    value: null,
  },
  passphrase: {
    value: (account && account.passphrase) || '',
  },
});

export const authStateIsValid = state => (
  !state.passphrase.error &&
  state.passphrase.value !== '' &&
  !state.secondPassphrase.error &&
  state.secondPassphrase.value !== ''
);

export const passphraseIsValid = passphrase => (!passphrase.error && passphrase.value !== '');

export const handleChange = function (name, value, error) {
  this.setState({
    [name]: {
      value,
      error: typeof error === 'string' ? error : undefined,
    },
  });
};
