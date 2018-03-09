const env = {
  production: PRODUCTION,
  test: TEST,
  development: (!PRODUCTION && !TEST),
  defaultNetwork: 'mainnet',
  testNetwork: 'customNode',
};

export default env;
