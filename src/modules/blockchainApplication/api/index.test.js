import { getState } from '@fixtures/transactions';
import http from '@common/utilities/api/http';
import { getApplication } from '.';

jest.mock('@common/utilities/api/http', () =>
  jest.fn().mockImplementation(() => Promise.resolve({ data: [{ type: 0 }] })));

const baseUrl = 'http://custom-base-url.com/';
const sampleId = 'sample_id';
const { network } = getState();

describe('get blockchain application detail', () => {
  it('Should call http with given params', () => {
    getApplication({
      network,
      baseUrl,
      params: { chainId: sampleId },
    });

    expect(http).toHaveBeenCalledWith({
      path: '/api/v2/blockchain/apps',
      params: { chainId: sampleId },
      network,
      baseUrl,
    });
  });
});
