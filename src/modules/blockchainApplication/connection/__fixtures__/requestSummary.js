import { EVENTS } from '@libs/wcm/constants/lifeCycle';

// eslint-disable-next-line import/prefer-default-export
export const context = {
  events: [{
    name: EVENTS.SESSION_REQUEST,
    meta: {
      params: {
        chainId: 'lisk:2',
        request: {
          method: ['sign_transaction'],
          params: {
            rawTx: {
              moduleID: 2,
              commandID: 0,
              senderPublicKey: '6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef',
              nonce: '52n',
              fee: '213000n',
              signatures: [],
              params: {
                recipientAddress: 'b778fc95b9f07407e6409d73c8af1919d9035002',
                amount: '910000n',
                data: '',
              },
              id: 'fd22e283b9901ab1b3f812b1f1c62b08325b1b43aef365d7895eeb58597b6614',
            },
          },
        },
      },
    },
  }],
  session: {
    request: {
      peer: {
        metadata: {
          icons: ['http://example.com/icon.png'],
          name: 'test app',
          url: 'http://example.com',
        },
      },
    },
  },
};
