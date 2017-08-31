
export const authStatePrefill = account => ({
  secondPassphrase: {
    value: null,
  },
  passphrase: {
    value: (account && account.passphrase) || '',
  },
});

export const handleChange = (component, name, value, error) => {
  component.setState({
    [name]: {
      value,
      error: typeof error === 'string' ? error : undefined,
    },
  });
};
