import SignClient from '@walletconnect/sign-client';
import pkg from '../../../package.json';

export let client;

export async function createSignClient() {
  client = await SignClient.init({
    projectId: process.env.PROJECT_ID,
    relayUrl: process.env.RELAY_URL,
    metadata: {
      name: pkg.name,
      description: pkg.description,
      url: pkg.url,
      icons: ['https://lisk.com/documentation/_/img/lisk-symbol.svg'],
    },
  });

  return client;
}
