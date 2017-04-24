import BigNumber from 'bignumber.js';

BigNumber.config({ ERRORS: false });

app.factory('lsk', () => ({
  normalize(value) {
    return new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed();
  },
  from(value) {
    return new BigNumber(value * new BigNumber(10).pow(8)).round(0).toNumber();
  },
}));
