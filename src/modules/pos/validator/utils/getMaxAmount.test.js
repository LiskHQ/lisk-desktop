import accounts from '@tests/constants/wallets';
import getMaxAmount from './getMaxAmount';

const account = {
  ...accounts.genesis,
  summary: {
    ...accounts.genesis.summary,
    balance: 100.106e8,
  },
};
const network = {
  network: {
    networks: {
      LSK: {
        networkIdentifier: '15f0dacc1060e91818224a94286b13aa04279c640bd5d6f193182031d133df7c',
        moduleAssets: [
          {
            id: 'token:transfer',
            name: 'token:transfer',
          },
          {
            id: 'auth:registerMultisignature',
            name: 'keys:registerMultisignature',
          },
          {
            id: 'dpos:registerDelegate',
            name: 'dpos:registerDelegate',
          },
          {
            id: 'dpos:voteDelegate',
            name: 'dpos:voteDelegate',
          },
          {
            id: 'dpos:unlock',
            name: 'dpos:unlockToken',
          },
          {
            id: 'dpos:reportDelegateMisbehavior',
            name: 'dpos:reportDelegateMisbehavior',
          },
          {
            id: 'legacy:reclaim',
            name: 'legacyAccount:reclaimLSK',
          },
        ],
        serviceUrl: 'https://testnet-service.lisk.com',
      },
    },
    name: 'testnet',
  },
};
const voting = {
  voting: {
    [accounts.genesis.summary.address]: {
      confirmed: 20e8,
      unconfirmed: 20e8,
      username: 'genesis',
    },
  },
};

jest.mock('@transaction/api', () => ({
  getTransactionFee: jest.fn().mockImplementation(() => Promise.resolve({ value: '0.046' })),
}));

jest.mock('@pos/validator/store/actions/voting', () => ({
  stakeEdited: jest.fn(),
}));

describe('getMaxAmount', () => {
  it('Returns 10n LSK if: balance >= (10n LSK + fee + dust)', async () => {
    const result = await getMaxAmount({
      balance: account.summary.balance,
      nonce: account.sequence?.nonce,
      publicKey: account.summary.publicKey,
      address: account.summary.address,
      voting: voting.voting,
      network,
      numberOfSignatures: 0,
      mandatoryKeys: [],
      optionalKeys: [],
    });
    expect(result).toBe(0.8e10);
  });

  it('Returns (n-1) * 10 LSK if: 10n LSK < balance < (10n LSK + fee + dust)', async () => {
    const result = await getMaxAmount({
      balance: 1e10,
      nonce: account.sequence?.nonce,
      publicKey: account.summary.publicKey,
      address: account.summary.address,
      voting: voting.voting,
      network,
      numberOfSignatures: 0,
      mandatoryKeys: [],
      optionalKeys: [],
    });
    expect(result).toBe(0.7e10);
  });
});
