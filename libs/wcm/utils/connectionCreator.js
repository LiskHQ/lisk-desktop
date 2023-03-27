import SignClient from '@walletconnect/sign-client';
import { to } from 'await-to-js';
import pkg from '../../../package.json';

// eslint-disable-next-line import/no-mutable-exports
export let client;

export async function createSignClient() {
  const [, res] = await to(
    SignClient.init({
      projectId: process.env.PROJECT_ID ?? '8f2a5ab63f54b27471714e81d1a49da3',
      metadata: {
        name: pkg.name,
        description: pkg.description,
        url: pkg.homepage,
        // @todo replace this with Lisk Service provided assets by #4465
        icons: ['https://lisk.com/documentation/_/img/lisk-symbol.svg'],
      },
    })
  );

  client = res;
  return client;
}
