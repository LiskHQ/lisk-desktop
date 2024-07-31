export const liskMainnetApplication = {
  '00000000': {
    chainName: 'lisk_mainchain',
    displayName: 'Lisk',
    chainID: '00000000',
    title: 'Lisk - Mainnet',
    description: 'Metadata configuration for the Lisk blockchain (mainchain) in mainnet',
    networkType: 'mainnet',
    isDefault: true,
    status: 'activated',
    genesisURL: 'https://downloads.lisk.com/lisk/mainnet/genesis_block.json.tar.gz',
    projectPage: 'https://lisk.com',
    serviceURLs: [
      {
        http: 'https://service.lisk.com',
        ws: 'wss://service.lisk.com',
        apiCertificatePublicKey:
          '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwAOGlgzeePs8O7FjSU9a\nUKQg4EYSJNgQqkwD/ITAJ6TzcXRCUK+N230NaFcQ8EFJw/8Al0r8mpjpOOEpPZDq\n+WljcCRkVHXZCJMvgDNcstzdrt1fKzsCrER2jB3hDUXt04xzzlk8ArJG0JeD/CmW\nAsQqL/S6v/GRVTuViHqzWm2eF2XrduUK8wIbQ1y+7HoVdgZDf5MpuvEXluVX4IeJ\nMyzbn9djdrDkHkcbml8dOHyLE6GOS5jKtXj+bKhyTVlSZFbexxKYiBqCpR6kMUnM\nVrURmWGT+jb7UhGkJiP7EpFB7MjAB+yXMiygd6lz67qjG6wFky1wB9NYGJ/50rrV\nDQIDAQAB\n-----END PUBLIC KEY-----',
      },
    ],
    logo: {
      png: 'https://raw.githubusercontent.com/LiskHQ/app-registry/main/mainnet/Lisk/images/application/lisk.png',
      svg: 'https://raw.githubusercontent.com/LiskHQ/app-registry/main/mainnet/Lisk/images/application/lisk.svg',
    },
    explorers: [
      {
        url: 'https://liskscan.com',
        txnPage: 'https://liskscan.com/transactions',
      },
      {
        url: 'https://lisk.observer',
        txnPage: 'https://lisk.observer/transactions',
      },
    ],
    appNodes: [
      {
        url: 'https://mainnet.lisk.com',
        apiCertificatePublicKey:
          '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqiQIDBSSlqKeWo0st2Hy\nJRbDzqYgcZfQvOpttr4kMbDjAYnz6XvZe3kOHcnMM2ePWrAS66SHTqdVbEEiu9Kf\njEQQkmk/Xv7XSMQ5kwidv+ANNDjTaC9GRnUHQ3pH77ZZY5msq0kEvmDvyMljU9kD\neqpugQn7jQVTG7te7PyXnZxvzMq8tgDILEwRnkF2hUF6jCH5X763aOT7X6yKUKY5\nZSUqmStKGPt1i34E5Pvb2AumsApkyqXfST/N/h8NV3UXRTBQ/fwAEvtOj3IMNNrw\nRUZIYAvwPFxTLXF0Dfj0fEiLFQzq+VPk3jsD9EbH1FotHXPtgA7brvG0uHfWKNsQ\nIQIDAQAB\n-----END PUBLIC KEY-----',
        maintainer: 'Lightcurve GmbH',
      },
      {
        url: 'wss://mainnet.lisk.com',
        apiCertificatePublicKey:
          '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqiQIDBSSlqKeWo0st2Hy\nJRbDzqYgcZfQvOpttr4kMbDjAYnz6XvZe3kOHcnMM2ePWrAS66SHTqdVbEEiu9Kf\njEQQkmk/Xv7XSMQ5kwidv+ANNDjTaC9GRnUHQ3pH77ZZY5msq0kEvmDvyMljU9kD\neqpugQn7jQVTG7te7PyXnZxvzMq8tgDILEwRnkF2hUF6jCH5X763aOT7X6yKUKY5\nZSUqmStKGPt1i34E5Pvb2AumsApkyqXfST/N/h8NV3UXRTBQ/fwAEvtOj3IMNNrw\nRUZIYAvwPFxTLXF0Dfj0fEiLFQzq+VPk3jsD9EbH1FotHXPtgA7brvG0uHfWKNsQ\nIQIDAQAB\n-----END PUBLIC KEY-----',
        maintainer: 'Lightcurve GmbH',
      },
    ],
    backgroundColor: '#f7f9fb',
  },
};

export const liskTestnetApplication = {
  '01000000': {
    chainName: 'lisk_mainchain',
    displayName: 'Lisk',
    chainID: '01000000',
    title: 'Lisk - Testnet',
    description: 'Metadata configuration for the Lisk blockchain (mainchain) in testnet',
    networkType: 'testnet',
    isDefault: true,
    status: 'activated',
    genesisURL: 'https://downloads.lisk.com/lisk/testnet/genesis_block.json.tar.gz',
    projectPage: 'https://lisk.com',
    serviceURLs: [
      {
        http: 'https://testnet-service.lisk.com',
        ws: 'wss://testnet-service.lisk.com',
        apiCertificatePublicKey:
          '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA55eVRxMsjgsakiSmRJGN\ng7u5XCO63BzbyFeUUuZ5YGRodFDw/cVAaIg9mWAtYRQM3FemJRt6zGcneFTbfmFC\nFcrGFbFqbcBssuHeyaBQroP8E5NcYVy7ZYJmZTaFBL9fpFzgrGdnLgjrlTkx7G+d\n95299QFRfX+mtSXuU0qzsSJzLaO9TsED3+I0aH80nJtxO8/ZI+RqjmomV5aAU0EO\n4S7a7npMZjxVKqwEcUcHeGf+4VLFGDc821IV45T4OZCxRG0sWgbc/AglY1xzRzJv\n1PTTWSYaukKM4rsuVEh6P12dAvMowh4wPGGPkQopXfS135xuHeefjnILl5/OcwHF\n3wIDAQAB\n-----END PUBLIC KEY-----',
      },
    ],
    logo: {
      png: 'https://raw.githubusercontent.com/LiskHQ/app-registry/main/testnet/Lisk/images/application/lisk.png',
      svg: 'https://raw.githubusercontent.com/LiskHQ/app-registry/main/testnet/Lisk/images/application/lisk.svg',
    },
    explorers: [
      {
        url: 'https://testnet.liskscan.com',
        txnPage: 'https://testnet.liskscan.com/transactions',
      },
      {
        url: 'https://testnet.lisk.observer',
        txnPage: 'https://testnet.lisk.observer/transactions',
      },
    ],
    appNodes: [
      {
        url: 'https://testnet.lisk.com',
        apiCertificatePublicKey:
          '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA55eVRxMsjgsakiSmRJGN\ng7u5XCO63BzbyFeUUuZ5YGRodFDw/cVAaIg9mWAtYRQM3FemJRt6zGcneFTbfmFC\nFcrGFbFqbcBssuHeyaBQroP8E5NcYVy7ZYJmZTaFBL9fpFzgrGdnLgjrlTkx7G+d\n95299QFRfX+mtSXuU0qzsSJzLaO9TsED3+I0aH80nJtxO8/ZI+RqjmomV5aAU0EO\n4S7a7npMZjxVKqwEcUcHeGf+4VLFGDc821IV45T4OZCxRG0sWgbc/AglY1xzRzJv\n1PTTWSYaukKM4rsuVEh6P12dAvMowh4wPGGPkQopXfS135xuHeefjnILl5/OcwHF\n3wIDAQAB\n-----END PUBLIC KEY-----',
        maintainer: 'Lightcurve GmbH',
      },
      {
        url: 'wss://testnet.lisk.com',
        apiCertificatePublicKey:
          '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA55eVRxMsjgsakiSmRJGN\ng7u5XCO63BzbyFeUUuZ5YGRodFDw/cVAaIg9mWAtYRQM3FemJRt6zGcneFTbfmFC\nFcrGFbFqbcBssuHeyaBQroP8E5NcYVy7ZYJmZTaFBL9fpFzgrGdnLgjrlTkx7G+d\n95299QFRfX+mtSXuU0qzsSJzLaO9TsED3+I0aH80nJtxO8/ZI+RqjmomV5aAU0EO\n4S7a7npMZjxVKqwEcUcHeGf+4VLFGDc821IV45T4OZCxRG0sWgbc/AglY1xzRzJv\n1PTTWSYaukKM4rsuVEh6P12dAvMowh4wPGGPkQopXfS135xuHeefjnILl5/OcwHF\n3wIDAQAB\n-----END PUBLIC KEY-----',
        maintainer: 'Lightcurve GmbH',
      },
    ],
    backgroundColor: '#f7f9fb',
  },
};
