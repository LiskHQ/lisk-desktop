import BigNumber from 'bignumber.js';

BigNumber.config({ ERRORS: false });

app.factory('lsk', () => ({
  normalize(value) {
    return new BigNumber(value || 0).dividedBy(Math.pow(10, 8)).toString();
  },
  from(value) {
    return parseInt(value * Math.pow(10, 8), 10);
  },
}));
