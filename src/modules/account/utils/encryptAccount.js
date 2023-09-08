/* istanbul ignore file */
import { cryptography } from '@liskhq/lisk-client';
import { extractKeyPair, extractAddressFromPublicKey } from 'src/modules/wallet/utils/account';

const ARGON2 = {
  ITERATIONS: 3,
  MEMORY: 65536,
};

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
    // Recommended options https://github.com/LiskHQ/lips/pull/465/files
    const encryptOptions = {
      kdf: cryptography.encrypt.KDF.ARGON2,
      kdfparams: {
        iterations: ARGON2.ITERATIONS,
        memorySize: ARGON2.MEMORY,
      },
    };

    const crypto = await cryptography.encrypt.encryptMessageWithPassword(
      plainText,
      password,
      encryptOptions
    );

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
    const plainText = await cryptography.encrypt.decryptMessageWithPassword(
      crypto,
      password,
      'utf-8'
    );
    return {
      error: null,
      result: JSON.parse(plainText),
    };
  } catch (error) {
    return { error: true };
  }
};
