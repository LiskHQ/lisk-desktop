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
