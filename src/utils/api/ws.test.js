import ws from './ws';

describe('ws', () => {
  const baseUrl = 'http://sample-service-url.com';

  it('should return a promise', () => {
    const wsPromise = ws({
      baseUrl,
      requests: [{
        method: 'account.get',
        params: { address: '12L' },
      }],
    });

    expect(typeof wsPromise.then).toEqual('function');
    expect(typeof wsPromise.catch).toEqual('function');
  });
});
