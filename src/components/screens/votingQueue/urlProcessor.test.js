import urlProcessor from './urlProcessor';
import { voteEdited } from '../../../actions/voting';
import * as accountApi from '../../../utils/api/lsk/account';

jest.mock('../../../utils/api/lsk/account', () => ({
  getAccount: jest.fn().mockResolvedValue({ address: '12L', username: 'username' }),
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
    await urlProcessor('?modal=voteQueue')(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(voteEdited([]));
  });

  it.skip('Should dispatch voteEdited with an array of valid usernames in query params', async () => {
    await urlProcessor('?modal=voteQueue&votes=username_1&username_2&unvotes=username_3&username_4')(dispatch, getState);
    const votes = ['username_1', 'username_2', 'username_3', 'username_4']
      .map(() => ({ address: '12L', username: 'username', amount: '' }));
    expect(dispatch).toHaveBeenCalledWith(voteEdited(votes));
  });
});
