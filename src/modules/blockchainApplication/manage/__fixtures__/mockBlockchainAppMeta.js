/* eslint-disable import/prefer-default-export */
export const mockBlockchainAppMeta = {
  data: [
    {
      chainName: 'Lisk',
      chainID: '00000001',
      title: '',
      description: '',
      networkType: 'mainnet',
      isDefault: true,
      genesisURL: 'https://downloads.lisk.com/lisk/mainnet/genesis_block.json.tar.gz',
      projectPage: 'https://lisk.com',
      appPage: '',
      logo: {
        png: 'https://downloads.lisk.com/lisk/images/logo.png',
        svg: 'https://downloads.lisk.com/lisk/images/logo.svg',
      },
      backgroundColor: '#0981D1',
      serviceURLs: [
        {
          http: 'https://service.lisk.com',
          ws: 'wss://service.lisk.com',
        },
      ],
      explorers: [
        {
          url: 'https://lisk.observer',
          txnPage: 'https://lisk.observer/transactions',
        },
        {
          url: 'https://liskscan.com',
          txnPage: 'https://liskscan.com/transactions',
        },
      ],
      appNodes: [
        {
          url: 'https://mainnet.lisk.com',
          maintainer: 'Lightcurve GmbH',
        },
        {
          url: 'wss://mainnet.lisk.com',
          maintainer: 'Lightcurve GmbH',
        },
      ],
    },
  ],
  meta: {
    count: 1,
    offset: 0,
    total: 1,
  },
  links: {},
};
