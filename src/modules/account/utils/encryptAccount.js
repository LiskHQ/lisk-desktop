/* istanbul ignore file */
import { cryptography } from '@liskhq/lisk-client';
import { extractKeyPair, extractAddressFromPublicKey } from 'src/modules/wallet/utils/account';

const { encrypt } = cryptography;

// eslint-disable-next-line max-statements
export const encryptAccount = async ({
  recoveryPhrase,
  password,
  name,
  derivationPath,
  enableAccessToLegacyAccounts = false,
}) => {
  const options = {
    passphrase: recoveryPhrase,
    enableAccessToLegacyAccounts,
    derivationPath,
  };

  try {
    const { privateKey, publicKey, isValid } = await extractKeyPair(options);
    if (!isValid) {
      return { error: true };
    }
    const address = extractAddressFromPublicKey(publicKey);
    const plainText = JSON.stringify({ privateKey, recoveryPhrase });
    // TODO: Remove the options after resolving it in https://github.com/LiskHQ/lisk-desktop/issues/5107
    const crypto = await encrypt.encryptMessageWithPassword(plainText, password, {
      kdfparams: { memorySize: 2048 },
    });

    return {
      error: false,
      result: {
        crypto,
        metadata: {
          name,
          pubkey: publicKey,
          path: options.derivationPath,
          address,
          creationTime: new Date().toISOString(),
        },
        version: 1,
      },
    };
  } catch {
    return { error: true };
  }
};

export const decryptAccount = async (crypto, password) => {
  try {
    const plainText = await encrypt.decryptMessageWithPassword(crypto, password);
    return {
      error: null,
      result: JSON.parse(plainText),
    };
  } catch (error) {
    return { error: true };
  }
};
