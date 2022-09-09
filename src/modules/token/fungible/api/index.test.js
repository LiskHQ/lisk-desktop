import { getState } from '@fixtures/transactions';
import { mockAppTokens } from '@tests/fixtures/token';
import http from 'src/utils/api/http';
import { getTokens } from '.';

jest.mock('src/utils/api/http', () =>
  jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: [
        {
          chainID: 1,
          chainName: 'Lisk',
          assets: mockAppTokens,
        },
      ],
      meta: {
        count: 1,
        offset: 0,
        total: 1000,
      },
      links: {},
    })
  )
);

const baseUrl = 'http://custom-base-url.com/';
const { network } = getState();

describe('get usable tokens', () => {
  it('Should call http with given params', () => {
    getTokens({
      network,
      baseUrl,
      params: {},
    });

    expect(http).toHaveBeenCalledWith({
      path: '/api/v2/blockchain/apps/meta/tokens',
      params: {},
      network,
      baseUrl,
    });
  });
});
