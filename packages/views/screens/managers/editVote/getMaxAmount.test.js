import getMaxAmount from './getMaxAmount';
import accounts from '../../../../../tests/constants/accounts';

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
            id: '2:0',
            name: 'token:transfer',
          },
          {
            id: '4:0',
            name: 'keys:registerMultisignatureGroup',
          },
          {
            id: '5:0',
            name: 'dpos:registerDelegate',
          },
          {
            id: '5:1',
            name: 'dpos:voteDelegate',
          },
          {
            id: '5:2',
            name: 'dpos:unlockToken',
          },
          {
            id: '5:3',
            name: 'dpos:reportDelegateMisbehavior',
          },
          {
            id: '1000:0',
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

jest.mock('@transaction/utilities/api', () => ({
  getTransactionFee: jest.fn().mockImplementation(() => Promise.resolve({ value: '0.046' })),
}));

jest.mock('@dpos/store/actions', () => ({
  voteEdited: jest.fn(),
}));

describe('getMaxAmount', () => {
  it('Returns 10n LSK if: balance >= (10n LSK + fee + dust)', async () => {
    const result = await getMaxAmount(account, network, voting, accounts.genesis.summary.address);
    expect(result).toBe(1e10);
  });

  it('Returns (n-1) * 10 LSK if: 10n LSK < balance < (10n LSK + fee + dust)', async () => {
    const acc = {
      ...accounts.genesis,
      summary: {
        ...accounts.genesis.summary,
        balance: 1e10,
      },
    };
    const result = await getMaxAmount(acc, network, voting, accounts.genesis.summary.address);
    expect(result).toBe(9e9);
  });
});
