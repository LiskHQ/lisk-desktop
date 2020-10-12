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

  it('Should dispatch voteEdited with empty array if no usernames in query params', async () => {
    await urlProcessor('?modal=votingQueue')(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(voteEdited([]));
  });

  it('Should dispatch voteEdited with an array of valid usernames in query params', async () => {
    await urlProcessor('?modal=votingQueue&unvotes=genesis_3,genesis_4&votes=genesis_5,genesis_6,genesis_7')(dispatch, getState);
    const votes = ['genesis_5', 'genesis_6', 'genesis_7', 'genesis_3', 'genesis_4']
      .map(username => ({ address: '12L', username, amount: '' }));
    expect(dispatch).toHaveBeenCalledWith(voteEdited(votes));
  });
});
