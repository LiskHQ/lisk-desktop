import { tokensBalance, tokensSupported, tokensTopLskBalance } from '@tests/constants/tokens';

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

export const mockTokensSupported = {
  data: tokensSupported,
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
        png: 'https://downloads.lisk.com/lisk/images/tokens/lsk.png',
        svg: 'https://downloads.lisk.com/lisk/images/tokens/lsk.svg',
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
