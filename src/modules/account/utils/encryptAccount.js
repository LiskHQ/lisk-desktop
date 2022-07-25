import { cryptography } from '@liskhq/lisk-client';
import { extractKeyPair, extractAddressFromPublicKey } from 'src/modules/wallet/utils/account';
import { defaultDerivationPath } from 'src/utils/explicitBipKeyDerivation';

// eslint-disable-next-line
export const encryptAccount = async ({
  recoveryPhrase,
  password,
  name,
  derivationPath,
  enableCustomDerivationPath = false,
}) => {
  const { encrypt } = cryptography;
  const options = {
    passphrase: recoveryPhrase,
    enableCustomDerivationPath,
    derivationPath: enableCustomDerivationPath ? derivationPath : defaultDerivationPath,
  };
  const { privateKey, publicKey, isValid } = extractKeyPair(options);
  if (!isValid) {
    throw new Error('Failed to extract keypair for given recovery phrase.');
  }
  const address = extractAddressFromPublicKey(publicKey);
  const plainText = JSON.stringify({ privateKey, recoveryPhrase });
  const encryptedPassphrase = await encrypt.encryptPassphraseWithPassword(plainText, password);

  return {
    encryptedPassphrase,
    metadata: {
      name,
      pubkey: publicKey,
      path: derivationPath ?? defaultDerivationPath,
      address,
      creationTime: new Date().toISOString(),
    },
    version: 1,
  };
};

export const decryptAccount = async (encryptedPassphrase, password) => {
  const { encrypt } = cryptography;
  console.log('--- start ---');
  const plainText = await encrypt.decryptPassphraseWithPassword(
    encryptedPassphrase,
    password,
  );
  console.log('--- end ---');
  const { recoveryPhrase } = JSON.parse(plainText);
  return recoveryPhrase;
};
