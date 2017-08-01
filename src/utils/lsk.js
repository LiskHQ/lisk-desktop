import BigNumber from 'bignumber.js';

BigNumber.config({ ERRORS: false });

export const fromRawLsk = value => (
  new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed()
);

export const toRawLsk = value => (
  new BigNumber(value * new BigNumber(10).pow(8)).round(0).toNumber()
);
