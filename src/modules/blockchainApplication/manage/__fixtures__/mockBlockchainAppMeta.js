/* eslint-disable import/prefer-default-export */
export const mockBlockchainAppMeta = {
  data: [
    {
      chainName: 'Lisk',
      chainID: '00000001',
      title: '',
      description: '',
      networkType: 'mainnet',
      genesisURL: 'https://downloads.lisk.com/lisk/mainnet/genesis_block.json.tar.gz',
      projectPage: 'https://lisk.com',
      logo: {
        png: 'https://lisk-qa.ams3.digitaloceanspaces.com/Artboard%201%20copy%2019.png',
        svg: 'https://lisk-qa.ams3.digitaloceanspaces.com/Logo-20.svg',
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
    {
      chainName: 'Colecti',
      chainID: '00000002',
      title: '',
      description: '',
      networkType: 'mainnet',
      isDefault: true,
      genesisURL: 'https://downloads.colecti.com/colecti/mainnet/genesis_block.json.tar.gz',
      projectPage: 'https://colecti.com',
      appPage: '',
      logo: {
        png: 'https://colecti.com/wp-content/uploads/2022/09/Beeldmerk-rond.png',
        svg: 'https://colecti.com/wp-content/uploads/2022/09/Beeldmerk-rond.svg',
      },
      backgroundColor: '#0981D1',
      serviceURLs: [
        {
          http: 'https://service.colecti.com',
          ws: 'wss://service.colecti.com',
        },
      ],
      explorers: [
        {
          url: 'https://colecti.observer',
          txnPage: 'https://colecti.observer/transactions',
        },
        {
          url: 'https://colectiscan.com',
          txnPage: 'https://colectiscan.com/transactions',
        },
      ],
      appNodes: [
        {
          url: 'https://mainnet.colecti.com',
          maintainer: 'Colecti',
        },
        {
          url: 'wss://mainnet.colecti.com',
          maintainer: 'Colecti',
        },
      ],
    },
    {
      chainName: 'Enevti',
      chainID: '00000003',
      title: '',
      description: '',
      networkType: 'mainnet',
      isDefault: true,
      genesisURL: 'https://downloads.enevti.com/enevti/mainnet/genesis_block.json.tar.gz',
      projectPage: 'https://enevti.com',
      appPage: '',
      logo: {
        png: 'https://drive.google.com/uc?id=1-TN72tUDpo8HtF1X167Tyc13r9V8gVJs',
        svg: 'https://drive.google.com/uc?id=1-TN72tUDpo8HtF1X167Tyc13r9V8gVJs',
      },
      backgroundColor: '#0981D1',
      serviceURLs: [
        {
          http: 'https://service.enevti.com',
          ws: 'wss://service.enevti.com',
        },
      ],
      explorers: [
        {
          url: 'https://enevti.observer',
          txnPage: 'https://enevti.observer/transactions',
        },
        {
          url: 'https://enevtiscan.com',
          txnPage: 'https://enevtiscan.com/transactions',
        },
      ],
      appNodes: [
        {
          url: 'https://mainnet.enevti.com',
          maintainer: 'Enevti',
        },
        {
          url: 'wss://mainnet.enevti.com',
          maintainer: 'Enevti',
        },
      ],
    },
  ],
  meta: {
    count: 3,
    offset: 0,
    total: 3,
  },
  links: {},
};
