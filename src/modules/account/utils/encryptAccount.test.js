import { cryptography, passphrase } from '@liskhq/lisk-client';
import { encryptAccount, decryptAccount } from './encryptAccount';

const recoveryPhrase =
  'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
const encryptedPassphrase = {
  kdf: 'argon2id',
  kdfparams: {
    parallelism: 4,
    iterations: 1,
    memory: 2048,
    salt: '30fc0301d36fcdc7bd8204e19a0043fc',
  },
  cipher: 'aes-256-gcm',
  cipherparams: {
    iv: '281d21872c2d303e59850ce4',
    tag: '2458479edf6aea5c748021ae296e467d',
  },
  ciphertext:
    '44fdb2b132d353a5c65f04e5e3afdd531f63abc45444ffd4cdbc7dedc45f899bf5b7478947d57319ea8c620e13480def8a518cc05e46bdddc8ef7c8cfc21a3bd',
};

const mockAccount = {
  encryptedPassphrase,
  metadata: {
    name: 'test account',
    pubkey: 'c6bae83af23540096ac58d5121b00f33be6f02f05df785766725acdd5d48be9d',
    path: "m/44'/134'/0'",
    address: 'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg',
    creationTime: new Date().toISOString(),
    derivedFromUUID: 'fa3e4ceb-10dc-41ad-810e-17bf51ed93aa',
  },
  version: 1,
};

const privateKey =
  'd92f8ffd3046fa9de33c21cef7af6f1315e289003c19f9b23ce6d499c8641d4e0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184';
const publicKey = '0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184';
const address = 'lskr4npg3esse6duo56u2war7umuo8embs4cwrkaf';
const defaultKeys = {
  privateKey: Buffer.from(privateKey, 'hex'),
  publicKey: Buffer.from(publicKey, 'hex'),
};

jest.spyOn(cryptography.legacy, 'getKeys').mockReturnValue(defaultKeys);
jest.spyOn(cryptography.encrypt, 'decryptMessageWithPassword').mockResolvedValue(
  JSON.stringify({
    recoveryPhrase,
  })
);
jest
  .spyOn(cryptography.encrypt, 'encryptMessageWithPassword')
  .mockResolvedValue(encryptedPassphrase);
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);
jest.spyOn(passphrase.Mnemonic, 'validateMnemonic').mockReturnValue(true);
jest
  .spyOn(cryptography.ed, 'getPrivateKeyFromPhraseAndPath')
  .mockResolvedValue(defaultKeys.privateKey);

describe('encryptAccount', () => {
  const password = 'samplePassword@1';
  const name = 'test account';
  const derivationPath = "m/44'/134'/0'";
  const accountDetails = {
    recoveryPhrase,
    password,
    name,
    derivationPath,
  };

  it('encrypts account when the correct arguments are passed', async () => {
    const updatedMockAccount = {
      encryptedPassphrase: { ...mockAccount.encryptedPassphrase },
      metadata: {
        name,
        pubkey: '0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184',
        path: derivationPath,
        address: 'lskr4npg3esse6duo56u2war7umuo8embs4cwrkaf',
        creationTime: expect.any(String),
      },
      version: 1,
    };
    const { error, result } = await encryptAccount(accountDetails);
    expect(error).toEqual(false);
    expect(result).toEqual(updatedMockAccount);
  });

  it('encrypts account with custom derivation path', async () => {
    const customDerivationPath = "m/44'/134'/1'";
    const updatedMockAccount = {
      encryptedPassphrase: { ...mockAccount.encryptedPassphrase },
      metadata: {
        name,
        pubkey: '0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184',
        path: customDerivationPath,
        address: 'lskr4npg3esse6duo56u2war7umuo8embs4cwrkaf',
        creationTime: expect.any(String),
      },
      version: 1,
    };
    const { error, result } = await encryptAccount({
      ...accountDetails,
      derivationPath: customDerivationPath,
      enableCustomDerivationPath: true,
    });
    expect(error).toEqual(false);
    expect(result).toEqual(updatedMockAccount);
  });

  it('returns an error if passphrase is invalid', async () => {
    const incorrectRecoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink';
    jest.spyOn(passphrase.Mnemonic, 'validateMnemonic').mockReturnValue(false);

    const { error, result } = await encryptAccount({
      ...accountDetails,
      recoveryPhrase: incorrectRecoveryPhrase,
    });
    expect(error).toBeTruthy();
    expect(result).toEqual(undefined);
  });
});

describe('decryptAccount', () => {
  it('decrypts account when the correct arguments are passed', async () => {
    const password = 'samplePassword@1';
    const { error, result } = await decryptAccount(encryptedPassphrase, password);
    expect(result).toEqual({ recoveryPhrase });
    expect(error).toEqual(null);
  });

  it('should return error when fail to decrypt message with password', async () => {
    jest.spyOn(cryptography.encrypt, 'decryptMessageWithPassword').mockRejectedValue();
    const password = 'samplePassword@1';
    const { error, result } = await decryptAccount(encryptedPassphrase, password);
    expect(result).toEqual(undefined);
    expect(error).toBeTruthy();
  });
});
