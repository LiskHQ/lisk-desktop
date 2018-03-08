const env = {
  production: PRODUCTION,
  test: TEST,
  development: (!PRODUCTION && !TEST),
  defaultNetwork: 'mainnet',
};

export default env;
