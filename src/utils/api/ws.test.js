import ws from './ws';

describe('ws', () => {
  it('should return a promise', () => {
    const wsPromise = ws({
      baseUrl: 'http://sample-service-rul.com',
      requests: [{
        method: 'account.get',
        params: { address: '12L' },
      }],
    });

    expect(typeof wsPromise.then).toEqual('function');
    expect(typeof wsPromise.catch).toEqual('function');
  });
});
