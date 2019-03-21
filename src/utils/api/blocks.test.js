import { getBlocks } from './blocks';
import accounts from '../../../test/constants/accounts';

describe('Blocks Api', () => {
  const liskAPIClient = {
    blocks: {
      get: jest.fn(),
    },
  };

  it('should return getBlocks', async () => {
    const options = {
      publicKey: accounts.delegate.publicKey,
      limit: 1,
    };
    const response = { data: [] };
    liskAPIClient.blocks.get.mockResolvedValue(response);

    const returnedBlocks = await getBlocks(liskAPIClient, options);

    return expect(returnedBlocks).toEqual(response);
  });
});
