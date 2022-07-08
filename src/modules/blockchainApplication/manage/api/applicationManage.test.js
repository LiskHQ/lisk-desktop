import { getState } from '@fixtures/transactions';
import http from 'src/utils/api/http';
import { getApplications } from './applicationManage';

jest.mock('src/utils/api/http', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })));

const baseUrl = 'http://custom-base-url.com/';
const { network } = getState();

describe('get blockchain application detail', () => {
  it('Should call http with given params', () => {
    getApplications({
      network,
      baseUrl,
      params: {},
    });

    expect(http).toHaveBeenCalledWith({
      path: '/api/v2/blockchain/apps',
      params: {},
      network,
      baseUrl,
    });
  });
});
