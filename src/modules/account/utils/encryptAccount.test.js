import { encryptAccount, decryptAccount } from './encryptAccount';

const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
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

describe('encryptAccount', () => {
  it('encrypts account when the correct arguments are passed', () => {
    const password = 'samplePassword@1';
    const name = 'test account';
    const derivationPath = "m/44'/134'/0'";
    const accountDetails = {
      recoveryPhrase, password, name, derivationPath,
    };
    const updatedMockAccount = {
      encryptedPassphrase: { ...mockAccount.crypto },
      metadata: {
        name,
        pubkey: '0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184',
        path: derivationPath,
        address: 'lskr4npg3esse6duo56u2war7umuo8embs4cwrkaf',
        creationTime: expect.any(String),
      },
      version: 1,
    };
    expect(encryptAccount(accountDetails)).toEqual(updatedMockAccount);
  });

  it('returns an error if passphrase is invalid', () => {
    const incorrectRecoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink';
    const password = 'samplePassword@1';
    const name = 'test account';
    const derivationPath = "m/44'/134'/0'";
    const accountDetails = {
      incorrectRecoveryPhrase, password, name, derivationPath,
    };
    const expectedResult = { error: true };
    expect(encryptAccount(accountDetails)).toEqual(expectedResult);
  });
});

describe('decryptAccount', () => {
  it('decrypts account when the correct arguments are passed', () => {
    const privateKey = 'private-key-mock';
    const password = 'samplePassword@1';
    const encryptedAccount = mockAccount.crypto;
    const expectedResult = { privateKey, recoveryPhrase, error: false };
    expect(decryptAccount(encryptedAccount, password)).toEqual(expectedResult);
  });
});
