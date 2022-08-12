import { server } from './server';

jest.mock('msw/node', () => ({
  setupServer: jest.fn(() => 'foo'),
}));

describe('useNetworkStatus hook', () => {
  it('fetching data correctly', async () => {
    expect(server).toEqual('foo');
  });
});
