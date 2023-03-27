export const mockCcm = {
  data: [
    {
      moduleCrossChainCommandID: '64:3',
      moduleCrossChainCommandName: 'interoperability:mainchainCCUpdate',
      sendingChainID: 'sendingChainIdentifier',
      receivingChainID: 'receivingChainIdentifier',
      nonce: '0',
      fee: '1000000',
      status: 'ok',
      params: {
        amount: '150000000',
        recipient: {
          address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
          publicKey: '2ca9a7...c23079',
          name: 'genesis_49',
        },
        data: 'message',
      },
      block: {
        id: '6258354802676165798',
        height: 8350681,
        timestamp: 28227090,
        transactionID: '12435autb1353anmbmab',
      },
      ccms: ['ccmID1', 'ccmID2'],
    },
  ],
  meta: {
    count: 1,
    offset: 0,
    total: 100,
  },
};
