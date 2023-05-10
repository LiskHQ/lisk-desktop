import {
  escrowedAmounts,
  tokensBalance,
  tokensSupported,
  tokensTopLskBalance,
  totalSupply,
} from '@token/fungible/__fixtures__/tokens';

export const mockTokensBalance = {
  data: tokensBalance,
  meta: {
    address: 'lsk6757819470afeb656',
    count: 5,
    offset: 0,
    total: 120,
  },
};

export const mockTokensTopLskBalance = {
  data: tokensTopLskBalance,
  meta: {
    address: 'lsk6757819470afeb131',
    count: 20,
    offset: 0,
    total: 30,
  },
};
export const mockTokenSummary = {
  data: {
    escrowedAmounts,
    supportedTokens: tokensSupported,
    totalSupply,
  },
  meta: {
    count: 3,
    offset: 0,
    total: 5,
  },
};

export const mockAppsTokens = {
  data: [
    {
      chainID: '00000001',
      chainName: 'Lisk',
      tokenID: '0000000100000000',
      tokenName: 'Lisk',
      networkType: 'mainnet',
      description: 'Base token for the Lisk ecosystem',
      denomUnits: [
        {
          denom: 'beddows',
          decimals: 0,
        },
        {
          denom: 'lisk',
          decimals: 8,
          aliases: ['Lisk'], // Optional
        },
      ],
      baseDenom: 'beddows',
      displayDenom: 'lisk',
      symbol: 'LSK',
      logo: {
        png: 'https://lisk-qa.ams3.digitaloceanspaces.com/Artboard%201%20copy%2019.png',
        svg: 'https://downloads.lisk.com/lisk/images/tokens/lsk.svg',
      },
    },
    {
      chainID: '00000002',
      chainName: 'Colecti',
      tokenID: '0000000200000000',
      tokenName: 'Colecti',
      networkType: 'mainnet',
      description: 'Base token for the Colecti ecosystem',
      denomUnits: [
        {
          denom: 'colecti',
          decimals: 8,
        },
      ],
      baseDenom: 'cols',
      displayDenom: 'colecti',
      symbol: 'COL',
      logo: {
        png: 'https://colecti.com/wp-content/uploads/2022/09/Beeldmerk-rond.png',
        svg: 'https://colecti.com/wp-content/uploads/2022/09/Beeldmerk-rond.svg',
      },
    },
    {
      chainID: '00000003',
      chainName: 'Enevti',
      tokenID: '0000000300000000',
      tokenName: 'Enevti',
      networkType: 'mainnet',
      description: 'Base token for the Enevti ecosystem',
      denomUnits: [
        {
          denom: 'enevti',
          decimals: 8,
        },
      ],
      baseDenom: 'enevti',
      displayDenom: 'enevti',
      symbol: 'EVT',
      logo: {
        png: 'https://drive.google.com/uc?id=1-TN72tUDpo8HtF1X167Tyc13r9V8gVJs',
        svg: 'https://drive.google.com/uc?id=1-TN72tUDpo8HtF1X167Tyc13r9V8gVJs',
      },
    },
    {
      chainID: '00000004',
      chainName: 'DoEdu',
      tokenID: '0000000400000000',
      tokenName: 'DoEdu',
      networkType: 'mainnet',
      description: 'Base token for the DoEdu ecosystem',
      denomUnits: [
        {
          denom: 'doedu',
          decimals: 8,
        },
      ],
      baseDenom: 'edus',
      displayDenom: 'doedu',
      symbol: 'DEU',
      logo: {
        png: 'https://doedu.com/wp-content/uploads/2022/09/Beeldmerk-rond.png',
        svg: 'https://doedu.com/wp-content/uploads/2022/09/Beeldmerk-rond.svg',
      },
    },
    {
      chainID: '00000005',
      chainName: 'Kalipo',
      tokenID: '0000000500000000',
      tokenName: 'Kalipo',
      networkType: 'mainnet',
      description: 'Base token for the Kalipo ecosystem',
      denomUnits: [
        {
          denom: 'kalipo',
          decimals: 8,
        },
      ],
      baseDenom: 'kals',
      displayDenom: 'kalipo',
      symbol: 'KAL',
      logo: {
        png: 'https://drive.google.com/uc?id=1-TN72tUDpo8HtF1X167Tyc13r9V8gVJs',
        svg: 'https://drive.google.com/uc?id=1-TN72tUDpo8HtF1X167Tyc13r9V8gVJs',
      },
    },
  ],
  meta: {
    count: 1,
    offset: 0,
    total: 1,
  },
  links: {},
};

export const mockTokensAccountExists = {
  data: {
    isExists: false,
  },
  meta: {},
};
