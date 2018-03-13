const env = {
  production: PRODUCTION,
  development: (!PRODUCTION && !TEST),
  test: TEST,
};

export default env;
