// eslint-disable-next-line no-unused-vars

// TODO this function should import from SDK
// eslint-disable-next-line no-unused-vars
const decryptAES256GCMWithPassword = (crypto, password) => JSON.stringify({
  privateKey: 'private-token-mock',
  recoveryPhrase: 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
});

// eslint-disable-next-line
export const decryptAccount = (accountSchema, password) => {
  try {
    const planText = decryptAES256GCMWithPassword(crypto, password);
    const { privateKey, recoveryPhrase } = JSON.parse(planText);
    return { privateKey, recoveryPhrase, error: false };
  } catch (e) {
    return { privateKey: null, recoveryPhrase: null, error: true };
  }
};
