const env = {
  production: PRODUCTION,
  test: TEST,
  development: (!PRODUCTION && !TEST),
  defaultNetwork: DEFAULT_NETWORK,
};

export default env;
