import SignClient from '@walletconnect/sign-client';
import { createSignClient, client} from './connectionCreator';

jest.mock('@walletconnect/sign-client', () => ({
  init: jest.fn().mockResolvedValue(Promise.resolve({ mock: true })),
}));

describe('connectionCreator', () => {
  it('createSignClient function should call SignClient.init with right params', async () => {
    process.env = {
      PROJECT_ID: '2be454834309cb634d1472f88154ec8a',
      RELAY_URL: 'wss://relay.walletconnect.com',
    };
    expect(client).toEqual(undefined);
    const res = await createSignClient();
    expect(SignClient.init).toHaveBeenCalledWith({
      projectId: process.env.PROJECT_ID,
      relayUrl: process.env.RELAY_URL,
      metadata: {
        name: 'Lisk',
        description: 'Lisk',
        url: 'https://github.com/LiskHQ/lisk-desktop',
        icons: ['https://lisk.com/documentation/_/img/lisk-symbol.svg'],
      },
    });
    expect(res).toEqual({ mock: true });
    expect(client).toEqual({ mock: true });
  });
});
