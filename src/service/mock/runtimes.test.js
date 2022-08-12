import { worker } from './runtime';

jest.mock('msw', () => ({
  ...(jest.requireActual('msw')),
  setupWorker: jest.fn(() => 'foo'),
}));

describe('useNetworkStatus hook', () => {
  it('fetching data correctly', async () => {
    expect(worker).toEqual('foo');
  });
});
