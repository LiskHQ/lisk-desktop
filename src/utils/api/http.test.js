import http from './http';

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
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve('ok'),
      })
    );
    await http(data);

    expect(fetch).toHaveBeenCalledWith(
      `${data.network.networks.LSK.serviceUrl}${data.path}?id=test`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should be able to set an optional base url', async () => {
    const baseUrl = 'http://testnet.net';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve('ok'),
      })
    );

    await http({ ...data, baseUrl });
    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}${data.path}?id=test`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should return data', async () => {
    const expectedResponse = { test: ['ok'] };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(expectedResponse),
      })
    );
    const response = await http(data);
    expect(response).toEqual(expectedResponse);
  });

  it('should throw error when response.ok is false', async () => {
    const statusText = 'Response.ok is false';
    const message = 'api error';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        statusText,
        json: () => Promise.resolve({ message }),
      })
    );
    await expect(http(data)).rejects.toEqual(Error(message));
  });

  it('should throw error', async () => {
    const statusText = 'Error processing the HTTP call.';
    global.fetch = jest.fn().mockReturnValueOnce(Promise.reject(statusText));
    await expect(http(data)).rejects.toEqual(statusText);
  });
});
