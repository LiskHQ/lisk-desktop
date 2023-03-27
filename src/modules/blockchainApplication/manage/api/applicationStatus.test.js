import { getState } from '@fixtures/transactions';
import http from 'src/utils/api/http';
import { getApplicationStatus, getApplicationConfig } from './applicationStatus';

jest.mock('src/utils/api/http', () => jest.fn());

const baseUrl = 'http://custom-base-url.com/';
const serviceUrl = 'https://api.coinbase.com';
const { network } = getState();

const setApiResponseData = (data, api) => {
  api.mockImplementation(() => Promise.resolve(data));
};
const setApiRejection = (statusText, api) => {
  api.mockImplementation(() => Promise.reject(new Error(statusText)));
};
const resetApiMock = () => {
  http.mockClear();
};

beforeEach(() => {
  resetApiMock();
});

describe('applicationStatus', () => {
  it('makes a call to get network status', () => {
    getApplicationStatus({ baseUrl, network });
    expect(http).toHaveBeenCalledTimes(1);
    expect(http).toHaveBeenCalledWith({ baseUrl, network, path: '/api/v3/application/status' });
  });
});

describe('application config', () => {
  it('returns data if network config is successful', async () => {
    const expectedResponse = { status: 'ok', serviceUrl };
    setApiResponseData(expectedResponse, http);
    getApplicationConfig({ serviceUrl });
    await expect(
      getApplicationStatus({ baseUrl: serviceUrl, network: serviceUrl })
    ).resolves.toEqual(expectedResponse);
    expect(http).toHaveBeenCalledWith({
      baseUrl: serviceUrl,
      network: serviceUrl,
      path: '/api/v3/application/status',
    });
  });

  it('throws an error if API fails', () => {
    const expectedResponse = new Error('Application unavailable');
    setApiRejection(expectedResponse.message, http);
    getApplicationConfig({ serviceUrl });
    expect(getApplicationStatus({ baseUrl: serviceUrl, network: serviceUrl })).rejects.toEqual(
      expectedResponse
    );
  });
});
