import { getState } from '@fixtures/transactions';
import http from 'src/utils/api/http';
import { getStatistics } from '.';

jest.mock('src/utils/api/http', () =>
  jest.fn().mockImplementation(() => Promise.resolve({
    data: {
      registered: 2503,
      active: 2328,
      terminated: 35,
      totalSupplyLSK: '5000000',
      stakedLSK: '3000000',
      inflationRate: '4.50',
    },
  })));

const baseUrl = 'http://custom-base-url.com/';
const { network } = getState();

describe('get blockchain application statistics', () => {
  it('Should call http with given params', () => {
    getStatistics({
      network,
      baseUrl,
      params: { },
    });

    expect(http).toHaveBeenCalledWith({
      path: '/api/v3/blockchain/apps/statistics',
      params: { },
      network,
      baseUrl,
    });
  });
});
