import * as accounts from '@wallet/utils/api';
import mockAccounts from '@tests/constants/wallets';
import setVotesByLaunchProtocol from './urlProcessor';

jest.mock('@wallet/utils/api', () => ({
  getAccount: jest.fn().mockImplementation(data => Promise.resolve({
    summary: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99' },
    dpos: { delegate: { username: data.username } },
  })),
  getAccounts: jest.fn(),
}));

describe('setVotesByLaunchProtocol', () => {
  const network = {
    status: { online: true },
    name: 'Mainnet',
    networks: {
      LSK: {
        nodeUrl: 'hhtp://localhost:4000',
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      },
    },
  };
  const getState = () => ({ network });

  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should dispatch stakeEdited with empty array if no usernames in query params', async () => {
    accounts.getAccounts.mockImplementation(() => Promise.resolve([]));
    accounts.getAccount.mockImplementation({ data: mockAccounts.genesis });
    await setVotesByLaunchProtocol('?modal=StakingQueue')(dispatch, getState);
    expect(accounts.getAccount).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('Should dispatch stakeEdited with a single username in the query params', async () => {
    const account = {
      summary: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99' },
      dpos: { delegate: { username: 'genesis_5' } },
    };
    accounts.getAccounts.mockImplementation(() => Promise.resolve({
      data: [account],
    }));
    accounts.getAccount.mockImplementation({
      data: account,
    });
    await setVotesByLaunchProtocol('?modal=StakingQueue&unvotes=genesis_5')(dispatch, getState);
    expect(accounts.getAccounts).toHaveBeenCalledWith({
      params: { usernameList: ['genesis_5'] },
      network,
    });
    expect(accounts.getAccount).not.toHaveBeenCalledWith();
    expect(dispatch).toHaveBeenCalled();
  });

  it('Should dispatch stakeEdited with empty data if the username is invalid', async () => {
    accounts.getAccounts.mockImplementation(() => Promise.resolve({ data: [] }));
    accounts.getAccount.mockImplementation(() => Promise.resolve({ data: [] }));
    await setVotesByLaunchProtocol('?modal=StakingQueue&unvotes=ad')(dispatch, getState);
    expect(accounts.getAccounts).not.toHaveBeenCalled();
    expect(accounts.getAccount).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('Should dispatch stakeEdited with empty data if the usernames are invalid', async () => {
    const account = {
      summary: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99' },
      dpos: { delegate: { username: 'genesis_5' } },
    };
    accounts.getAccounts.mockImplementation({
      data: [account, account],
    });
    accounts.getAccount.mockImplementation(() => Promise.resolve({ data: [] }));
    await setVotesByLaunchProtocol('?modal=StakingQueue&unvotes=ad,genesis_5')(dispatch, getState);
    expect(accounts.getAccounts).not.toHaveBeenCalled();
    expect(accounts.getAccount).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('Should dispatch stakeEdited with an array of valid usernames in query params', async () => {
    const validator = Object.values(mockAccounts)
      .filter(account => account.pos.validator.username && account.summary.address);
    const usernameList = validator.map(account => account.pos.validator.username);
    const url = `?modal=stakingQueue&unvotes=${usernameList.join(',')}`;
    accounts.getAccounts.mockImplementation(() => Promise.resolve({ data: validator }));

    await setVotesByLaunchProtocol(url)(dispatch, getState);
    expect(accounts.getAccounts).toHaveBeenCalledWith({
      params: { usernameList: ['genesis_17', 'test'] },
      network,
    });
  });
});
