import { API_VERSION } from 'src/const/config';
import defaultClient from 'src/utils/api/client';
import { addTokensMetaData } from './addTokensMetaData';

describe('tokenTransformResult', () => {
  const createMetaConfig = (config) => config;
  it('should working fine with data corruption', async () => {
    const create = addTokensMetaData({ createMetaConfig, client: defaultClient, });
    const tokens = null;
    await expect(create(tokens)).resolves.toBe(tokens);
  });

  it('should working fine with metaData corruption', async () => {
    const mockTokenBalance = { tokenID: 1, balance: 1 }
    const create = addTokensMetaData({ createMetaConfig, client: defaultClient, });
    jest.spyOn(defaultClient, 'call').mockReturnValue({data: null})
    const tokens = [mockTokenBalance];
    await expect(create(tokens)).resolves.toEqual(tokens);
  });

  it('merge meta response', async () => {
    const mockTokenBalance = { tokenID: 1, balance: 1 }
    const mockTokenMeta = { tokenName: 'Lisk', tokenID: 1 }
    jest.spyOn(defaultClient, 'call').mockReturnValue({data: [mockTokenMeta]})
    const config = {
      url: `/api/${API_VERSION}/blockchain/apps/meta/tokens`,
      method: 'get',
    }
    const createConfig = jest.fn().mockReturnValue(config);
    const tokens = [mockTokenBalance];
    const create = addTokensMetaData({ createMetaConfig: createConfig, client: defaultClient, });
    await expect(create(tokens)).resolves.toMatchObject([{...mockTokenBalance, ...mockTokenMeta}])
    await expect(createConfig).toHaveBeenCalledWith({
      params: {
        limit: tokens.length,
        tokenID: '1'
      },
    });
    await expect(defaultClient.call).toHaveBeenCalledWith(config)

  });
});
