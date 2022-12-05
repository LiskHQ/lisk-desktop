import { server } from 'src/service/mock/server';
import client from 'src/utils/api/client';

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  client.create({ ws: 'ws://localhost', http: 'http://localhost' });
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
