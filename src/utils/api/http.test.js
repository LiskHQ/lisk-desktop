import http from './http';

describe('HTTP', () => {
  const data = {
    path: '/api/enpoint/',
    params: { id: 'test' },
    method: 'GET',
    network: { serviceUrl: 'http://liskdev.net' },
  };

  it('should be able to set an option base url', async () => {
    const baseUrl = 'http://testnet.net';
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve('ok'),
    }));
    await http(data);
    await http({ ...data, baseUrl });
    expect(fetch.mock.calls[0][0]).toEqual(`${data.network.serviceUrl}${data.path}`);
    expect(fetch.mock.calls[1][0]).toEqual(`${baseUrl}${data.path}`);
  });

  it('should return data', async () => {
    const expectedResponse = { test: ['ok'] };
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(expectedResponse),
    }));
    await expect(http(data)).resolves.toEqual(expectedResponse);
  });

  it('should throw error', async () => {
    const statusText = 'Error meanwhile processing the call';
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      status: 500,
      statusText,
      json: () => Promise.resolve('test'),
    }));
    await expect(http(data)).rejects.toEqual(Error(statusText));
  });
});
