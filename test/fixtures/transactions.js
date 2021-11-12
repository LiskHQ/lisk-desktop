const getState = () => ({
  account: {
    passphrase: 'test',
    info: {
      LSK: {
        summary: {
          address: 'lskwnxvy7wmgbt8y3mh7fcs4u4cwj7f48eh58kga9',
          publicKey: '205688492bc52ddabfdc10fa7728b8bcb5942ad17c68ab5c20e96153fd1ac657',
          privateKey: 'ae7522b1fd7a24886b1396b392368fe6c9b2e0e40cf86ecf193e46babe3cbe8a0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
        },
        sequence: { nonce: 0 },
      },
      BTC: {
        summary: { address: '16Qp9op3fTESTBTCACCOUNTv52ghRzYreUuQ' },
      },
    },
    loginType: 0,
  },
  network: {
    status: { online: true },
    name: 'Mainnet',
    networks: {
      LSK: {
        serviceUrl: 'http://localhost:4000',
        networkIdentifier: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        moduleAssetSchemas: {
          '2:0': {
            $id: 'lisk/transfer-asset',
            title: 'Transfer transaction asset',
            type: 'object',
            required: [
              'amount',
              'recipientAddress',
              'data',
            ],
            properties: {
              amount: {
                dataType: 'uint64',
                fieldNumber: 1,
              },
              recipientAddress: {
                dataType: 'bytes',
                fieldNumber: 2,
                minLength: 20,
                maxLength: 20,
              },
              data: {
                dataType: 'string',
                fieldNumber: 3,
                minLength: 0,
                maxLength: 64,
              },
            },
          },
          '5:1': {
            $id: 'lisk/dpos/vote',
            type: 'object',
            required: [
              'votes',
            ],
            properties: {
              votes: {
                type: 'array',
                minItems: 1,
                maxItems: 20,
                items: {
                  type: 'object',
                  required: [
                    'delegateAddress',
                    'amount',
                  ],
                  properties: {
                    delegateAddress: {
                      dataType: 'bytes',
                      fieldNumber: 1,
                      minLength: 20,
                      maxLength: 20,
                    },
                    amount: {
                      dataType: 'sint64',
                      fieldNumber: 2,
                    },
                  },
                },
                fieldNumber: 1,
              },
            },
          },
        },
      },
    },
  },
  transactions: {
    filters: {},
    signedTransaction: {},
  },
  settings: {
    token: {
      active: 'LSK',
    },
  },
  blocks: {
    latestBlocks: [{
      timestamp: 123123123,
    }],
  },
});

const transformedAccountTransaction = {
  moduleAssetId: '5:1',
  id: 'ad0e0acbe8a3ece3087c8362149ca39c470e565d268df32e57de5d3fe2e1ea5c',
  fee: '142000n',
  nonce: '2n',
  signatures: [
    '4bfc0ab5e1b3c3fb1ca7362acc917775ce6345f26a261d592d83c62ad156e90221269a3b423516c2b84c1ebdd285d3bf83be688f5a158c1daf7245fecea0350a',
  ],
  sender: {
    address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
    publicKey: '205688492bc52ddabfdc10fa7728b8bcb5942ad17c68ab5c20e96153fd1ac657',
  },
};

const newTransaction = {
  pending: [],
  confirmed: [],
  count: null,
  filters: {
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: '',
    message: '',
  },
  signedTransaction: {
    id: 1,
    asset: {
      amount: 112300000,
    },
    fee: 0.00012451,
  },
  txSignatureError: null,
  txBroadcastError: null,
};

export { getState, transformedAccountTransaction, newTransaction };
