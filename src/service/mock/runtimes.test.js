import { worker } from './runtime';

jest.mock('msw', () => ({
  setupWorker: jest.fn(() => 'mockServiceWorker'),
}));

describe('MSW worker', () => {
  it('working correctly', async () => {
    expect(worker).toBeDefined();
    expect(worker).toEqual('mockServiceWorker');
  });
});
