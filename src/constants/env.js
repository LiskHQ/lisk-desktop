const env = {
  production: PRODUCTION,
  test: TEST,
  development: (!PRODUCTION && !TEST),
};

export default env;
