import { cryptography } from '@liskhq/lisk-client';

// Comment: Why do we need separate files for encrypt and decrypt? they can be under one file?
// eslint-disable-next-line
export const decryptAccount = async (encryptedAccount, password) => {
  try {
    const plainText = await cryptography.encrypt.decryptPassphraseWithPassword({
      encryptedPassphrase: encryptedAccount,
      password,
    });
    const { privateKey, recoveryPhrase } = JSON.parse(plainText);
    return { privateKey, recoveryPhrase, error: false };
  } catch (error) {
    return { privateKey: null, recoveryPhrase: null, error: true };
  }
};
