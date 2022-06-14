import { encryptAccount, mockAccount } from './encryptAccount';

describe('encryptAccount', () => {
  it('encrypts account when the correct arguments are passed', () => {
    const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
    const password = 'samplePassword@1';
    const name = 'test account';
    const derivationPath = "m/44'/134'/0'";
    const accountDetails = {
      recoveryPhrase, password, name, derivationPath,
    };
    const updatedMockAccount = {
      crypto: { ...mockAccount.crypto },
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
    const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink';
    const password = 'samplePassword@1';
    const name = 'test account';
    const derivationPath = "m/44'/134'/0'";
    const accountDetails = {
      recoveryPhrase, password, name, derivationPath,
    };
    const expectedResult = { error: true };
    expect(encryptAccount(accountDetails)).toEqual(expectedResult);
  });
});
