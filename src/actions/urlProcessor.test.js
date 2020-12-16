import urlProcessor from './urlProcessor';
import { voteEdited } from './voting';

jest.mock('../utils/api/lsk/account', () => ({
  getAccount: jest.fn().mockImplementation(data => Promise.resolve({ address: '12L', username: data.username })),
}));

describe('urlProcessor', () => {
  const getState = () => ({
    network: {
      status: { online: true },
      name: 'Mainnet',
      networks: {
        LSK: {
          nodeUrl: 'hhtp://localhost:4000',
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      },
    },
  });

  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
  });

  it('Should dispatch voteEdited with empty array if no usernames in query params', async () => {
    await urlProcessor('?modal=votingQueue')(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(voteEdited([]));
  });

  it('Should dispatch voteEdited with a single username in the query params', async () => {
    await urlProcessor('?modal=votingQueue&unvotes=genesis_5')(dispatch, getState);
    const votes = ['genesis_5']
      .map(username => ({ address: '12L', username, amount: '' }));
    expect(dispatch).toHaveBeenCalledWith(voteEdited(votes));
  });

  it('Should dispatch voteEdited with empty data if the username is invalid', async () => {
    await urlProcessor('?modal=votingQueue&unvotes=ad')(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ data: [] }));
  });

  it('Should dispatch voteEdited with empty data if the usernames are invalid', async () => {
    await urlProcessor('?modal=votingQueue&unvotes=ad,genesis_5')(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ data: [] }));
  });

  it('Should dispatch voteEdited with an array of valid usernames in query params', async () => {
    await urlProcessor('?modal=votingQueue&unvotes=genesis_3,genesis_4&votes=genesis_5,genesis_6,genesis_7')(dispatch, getState);
    const votes = ['genesis_5', 'genesis_6', 'genesis_7', 'genesis_3', 'genesis_4']
      .map(username => ({ address: '12L', username, amount: '' }));
    expect(dispatch).toHaveBeenCalledWith(voteEdited(votes));
  });
});
