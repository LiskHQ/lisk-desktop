const env = {
  production: PRODUCTION,
  development: (!PRODUCTION && !TEST),
  defaultNetwork: 'mainnet',
  testNetwork: 'testnet',
};

export default env;

module.exports = {
  test: () => {
    /* eslint-disable no-console */
    console.log('ENV-TEST--> ', TEST);
    /* eslint-disable no-console */
    return TEST;
  },
};

