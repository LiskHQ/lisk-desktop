const env = {
  production: PRODUCTION,
  test: TEST,
  development: (!PRODUCTION && !TEST),
  defaultNetwork: 'mainnet',
  testNetwork: 'testnet',
};

export default env;
