module.exports = {
  testMatch: [
    '<rootDir>/*.test.js',
  ],
  verbose: true,
  cache: false,
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  reporters: [
    'default',
  ],
};
