import accounts from '@tests/constants/wallets';
import { mockAppsTokens } from 'src/modules/token/fungible/__fixtures__';
import getMaxAmount from './getMaxAmount';

const account = {
  ...accounts.genesis,
  summary: {
    ...accounts.genesis.summary,
    balance: 100.106e8,
  },
};

const staking = {
  [accounts.genesis.summary.address]: {
    confirmed: 20e8,
    unconfirmed: 20e8,
    username: 'genesis',
  },
};
const mockToken = mockAppsTokens.data[0];

jest.mock('@pos/validator/store/actions/staking', () => ({
  stakeEdited: jest.fn(),
}));

describe('getMaxAmount', () => {
  it('Returns 10n LSK if: balance >= (10n LSK + fee + dust)', async () => {
    const result = await getMaxAmount({
      balance: account.summary.balance,
      nonce: account.sequence?.nonce,
      publicKey: account.summary.publicKey,
      address: account.summary.address,
      staking,
      numberOfSignatures: 0,
      mandatoryKeys: [],
      optionalKeys: [],
      moduleCommandSchemas: {},
      token: mockToken,
    });
    expect(result).toBe(0.8e10);
  });

  it('Returns (n-1) * 10 LSK if: 10n LSK < balance < (10n LSK + fee + dust)', async () => {
    const result = await getMaxAmount({
      balance: 1e10,
      nonce: account.sequence?.nonce,
      publicKey: account.summary.publicKey,
      address: account.summary.address,
      staking,
      numberOfSignatures: 0,
      mandatoryKeys: [],
      optionalKeys: [],
      moduleCommandSchemas: {},
      token: mockToken,
    });
    expect(result).toBe(0.7e10);
  });
});
