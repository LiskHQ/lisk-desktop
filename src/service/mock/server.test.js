import { server } from './server';

describe('MSW server', () => {
  it('to be defined', async () => {
    expect(server).toHaveProperty('listen');
  });
});
