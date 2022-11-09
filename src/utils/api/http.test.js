import client from 'src/utils/api/client';
import http from './http';

jest.mock('src/utils/api/client');

describe('HTTP', () => {
  const data = {
    path: '/api/endpoint',
    params: { id: 'test' },
    method: 'GET',
    network: {
      networks: {
        LSK: { serviceUrl: 'http://liskdev.net' },
      },
    },
  };

  it('should make HTTP calls with given params', async () => {
    const updatedData = { ...data, method: 'PUT' };
    await http(updatedData);

    expect(client.rest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: updatedData.path,
        params: { id: 'test' },
        method: 'PUT',
      })
    );
  });

  it('should make HTTP calls with GET as default method', async () => {
    const noMethodData = {
      path: '/api/endpoint',
      params: { id: 'test' },
      network: {
        networks: {
          LSK: { serviceUrl: 'http://liskdev.net' },
        },
      },
    };
    await http(noMethodData);

    expect(client.rest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: noMethodData.path,
        params: { id: 'test' },
        method: 'GET',
      })
    );
  });

  it('should be able to set an optional base url', async () => {
    const baseUrl = 'http://testnet.net';

    await http({ ...data, baseUrl });
    expect(client.rest).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: baseUrl,
        url: `${data.path}`,
        params: { id: 'test' },
        method: 'GET',
      })
    );
  });

  it('should return data', async () => {
    const expectedResponse = { test: ['ok'] };
    client.rest.mockImplementation(() => Promise.resolve(expectedResponse));
    const response = await http(data);
    expect(response).toEqual(expectedResponse);
  });

  it.skip('should throw error when response.ok is false', async () => {
    const statusText = 'Response.ok is false';
    const message = 'api error';
    const response = {
      ok: false,
      status: 400,
      statusText,
      json: () => Promise.resolve({ message }),
    };
    client.rest.mockImplementation((config) => {
      const transformedResult = config.transformResult(response);
      Promise.resolve({
        ...response,
        json: () => Promise.resolve(transformedResult),
      });
    });
    await expect(http(data)).rejects.toEqual(new Error(message));
  });

  it('should throw error', async () => {
    const statusText = 'Error processing the HTTP call.';
    client.rest.mockImplementation(() => Promise.reject(statusText));
    await expect(http(data)).rejects.toEqual(statusText);
  });
});
