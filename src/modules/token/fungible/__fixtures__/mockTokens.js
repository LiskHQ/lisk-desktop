import { tokensBalance, tokensTopLskBalance } from '@tests/constants/tokens';

/* eslint-disable import/prefer-default-export */
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
    count: 10,
    offset: 0,
    total: 100,
  },
};
