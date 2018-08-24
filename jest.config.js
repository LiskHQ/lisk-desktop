module.exports = {
  modulePaths: ['src/components'],
  testMatch: [
    '<rootDir>/src/components/transactions/**/?(*.)test.js?(x)',
    '<rootDir>/test/integration/transactionID.test.js?(x)',
  ],
  verbose: true,
  moduleFileExtensions: ['js'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^.+\\.css$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/jest',
  collectCoverageFrom: [
    'src/**/*.js',
    'app/src/**/*.js',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageThreshold: {
    global: {
      branches: 79,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: [
    '<rootDir>/config/setupJest.js',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testURL: 'http://localhost',
};
