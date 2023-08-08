import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import moduleCommandSchemas from '@tests/constants/schemas';

// eslint-disable-next-line import/prefer-default-export
export const context = {
  events: [
    {
      name: EVENTS.SESSION_REQUEST,
      meta: {
        params: {
          chainId: 'lisk:00000001',
          request: {
            method: 'sign_transaction',
            params: {
              payload:
                '0a05746f6b656e12087472616e7366657218012080c2d72f2a20cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f53532290a0800000000000000001080a094a58d1d1a14e2121783af583a9a77955259e868bcc871d00d7d2200',
              schema: moduleCommandSchemas['token:transfer'],
              recipientChainID: '00000001',
            },
          },
        },
      },
    },
  ],
  session: {},
  sessionRequest: {
    peer: {
      metadata: {
        icons: ['http://example.com/icon.png'],
        name: 'test app',
        url: 'http://example.com',
      },
    },
    requiredNamespaces: { lisk: { chains: ['lisk:00000001'] } },
  },
};
