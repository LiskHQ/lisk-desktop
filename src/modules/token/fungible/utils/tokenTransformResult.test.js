import { API_VERSION } from 'src/const/config';
import { tokenTransformResult } from './tokenTransformResult';
import { clientMetaData } from 'src/utils/api/client';

describe('tokenTransformResult', () => {
  const createMetaConfig = (config) => config;
  it('should working fine in data croption', async () => {
    const create = tokenTransformResult({ createMetaConfig });
    const res = { data: null, meta: { page: 1 } };
    await expect(create(res)).resolves.toBe(res);
  });

  it('merge meta response', async () => {
    const mockTokenBalance = { tokenID: 1, balance: 1 }
    const mockTokenMeta = { tokenName: 'Lisk', tokenID: 1 }
    jest.spyOn(clientMetaData, 'call').mockReturnValue({data: [mockTokenMeta]})
    const config = {
      url: `/api/${API_VERSION}/blockchain/apps/meta/tokens`,
      method: 'get',
    }
    const createConfig = jest.fn().mockReturnValue(config);
    const res = { data: [mockTokenBalance] };
    const create = tokenTransformResult({ createMetaConfig: createConfig });
    await expect(create(res)).resolves.toMatchObject({data: [{...mockTokenBalance, ...mockTokenMeta}]})
    await expect(createConfig).toHaveBeenCalledWith({
      params: {
        limit: 100,
        tokenID: '1'
      },
    });
    await expect(clientMetaData.call).toHaveBeenCalledWith(config)

  });
});
