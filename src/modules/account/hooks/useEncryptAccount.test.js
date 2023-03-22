import { useEncryptAccount } from './useEncryptAccount';

const mockDispatch = jest.fn();
const mockState = {
  settings: {
    enableCustomDerivationPath: true,
    customDerivationPath: "m/44'/134'/1'",
  },
};
const recoveryPhrase = 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol';
const encryptedAccount = {
  crypto: {
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
  },
  metadata: {},
  version: 1,
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
}));

jest.mock('@account/utils', () => ({
  encryptAccount: jest.fn().mockResolvedValue(encryptedAccount),
}));

describe('useEncryptAccount', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('Should encrypt recovery phrase for given password', async () => {
    const password = 'samplePassword@1';
    const name = 'test account';
    const derivationPath = "m/44'/134'/0'";

    const { encryptAccount } = useEncryptAccount();
    const account = await encryptAccount({
      recoveryPhrase, password, name, derivationPath,
    });

    expect(account).toEqual(encryptedAccount);
  });
});
