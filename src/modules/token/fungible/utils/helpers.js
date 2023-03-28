import BigNumber from 'bignumber.js';
import liskLogo from '../../../../../setup/react/assets/images/LISK.png';

export const getLogo = ({ logo }) => logo?.svg || logo?.png || liskLogo;

BigNumber.config({ ERRORS: false });
const BASE = 10;

const defaultTokenMeta = {
  displayDenom: 'lsk',
  denomUnits: [
    {
      denom: 'beddows',
      decimals: 0,
      aliases: ['Beddows'],
    },
    {
      denom: 'lsk',
      decimals: 8,
      aliases: ['Lisk'],
    },
  ],
};

export const getTokenDecimals = (token) => {
  const { decimals } = token.denomUnits?.find?.(({ denom }) => denom === token.displayDenom) || {};

  return decimals;
};

/**
 * Converts a given token amount to its token symbol denom
 */
export const convertFromBaseDenom = (amount, token = defaultTokenMeta) => {
  const decimals = getTokenDecimals(token);

  if (!decimals) return '0';

  return new BigNumber(amount || 0).dividedBy(new BigNumber(BASE).pow(decimals)).toFixed();
};

/**
 * Converts from denom denoted by the token symbol to a smaller unit
 */
export const convertToBaseDenom = (amount, token = defaultTokenMeta) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(amount)) return '0';

  const decimals = getTokenDecimals(token);

  if (!decimals) return '0';

  return new BigNumber(amount || 0).multipliedBy(new BigNumber(BASE).pow(decimals)).toFixed();
};
