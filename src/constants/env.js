const env = {
  production: PRODUCTION,
  development: (!PRODUCTION && !TEST),
  defaultNetwork: 'mainnet',
  test: TEST,
  testNetwork: 'testnet',
};

export default env;
