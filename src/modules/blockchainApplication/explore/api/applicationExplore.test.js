import { getState } from '@fixtures/transactions';
import http from 'src/utils/api/http';
import { getApplication, getApplications, getFilteredOffChainApplications } from './applicationExplore';

jest.mock('src/utils/api/http', () =>
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
      path: '/api/v3/blockchain/apps',
      params: { chainId: sampleId },
      network,
      baseUrl,
    });
  });

  it('Should call getApplications', () => {
    getApplications({
      network,
      baseUrl,
      params: {},
    });

    expect(http).toHaveBeenCalledWith({
      path: '/api/v3/blockchain/apps',
      params: {},
      network,
      baseUrl,
    });
  });

  it('Should call getFilteredOffChainApplications', () => {
    getFilteredOffChainApplications({
      network,
      baseUrl,
      params: {},
    });

    expect(http).toHaveBeenCalledWith({
      path: '/api/v3/blockchain/apps/meta',
      params: {},
      network,
      baseUrl,
    });
  });
});
