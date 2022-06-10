// eslint-disable-next-line no-unused-vars

// TODO this function should import from SDK
// eslint-disable-next-line no-unused-vars
const decryptAES256GCMWithPassword = ({ encryptedPassphrase, password }) => JSON.stringify({
  privateKey: 'private-key-mock',
  recoveryPhrase: 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
});

// eslint-disable-next-line
export const decryptAccount = (accountSchema, password) => {
  try {
    const plainText = decryptAES256GCMWithPassword({
      encryptedPassphrase: accountSchema,
      password,
    });
    const { privateKey, recoveryPhrase } = JSON.parse(plainText);
    return { privateKey, recoveryPhrase, error: false };
  } catch (e) {
    return { privateKey: null, recoveryPhrase: null, error: true };
  }
};
