const env = {
  production: PRODUCTION,
  test: TEST,
  development: (!PRODUCTION && !TEST),
  defaultNetwork: DEFAULT_NEWTORK,
};

export default env;
