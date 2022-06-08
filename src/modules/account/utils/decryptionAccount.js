/* istanbul ignore file */
import { mockAccount } from './encryptionAccount';

// eslint-disable-next-line no-unused-vars
const decryptAES256GCMWithPassword = ({ encryptedPassphrase, password }) =>
  JSON.stringify(mockAccount.crypto);
// eslint-disable-next-line
export const decryptionAccount = (accountSchema, password) => {
  // TODO implement this function in ticket #4299
  const privateKey = 'private-token-mock';
  const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
  // eslint-disable-next-line no-unused-vars
  const result = decryptAES256GCMWithPassword({
    encryptedPassphrase: recoveryPhrase,
    password,
  });
  const error = null;

  return { privateKey, recoveryPhrase, error };
};
