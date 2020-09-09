import networkMiddleware from './network';

describe('actions: network.lsk', () => {
  const next = jest.fn();
  const otherActions = {
    type: 'ANY',
  };

  it('should only pass all actions', () => {
    const store = {
      dispatch: jest.fn(),
    };
    networkMiddleware(store)(next)(otherActions);
    expect(next.mock.calls.length).toBe(1);
  });
});
