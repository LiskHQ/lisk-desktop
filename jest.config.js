module.exports = {
  modulePaths: ['src/components'],
  testMatch: [
    '<rootDir>/app/src/**/*.test.js',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/test/integration/*.test.js',
  ],
  testPathIgnorePatterns: [
    'src/actions/transactions.test.js',
    'src/components/dashboard/currencyGraph.test.js', // This should be unskipped in issue #1499
    'src/components/errorBoundary/index.test.js',
    'src/components/feedbackForm/*.test.js',
    'src/components/hwWallet/*.test.js',
    'src/components/login/*.test.js',
    'src/components/newsFeed/index.test.js', // This component doesn't meet the setted tresholds for mocha but in jest
    'src/components/passphraseCreation/index.test.js',
    'src/components/register/register.test.js',
    'src/components/transactions/votedDelegates.test.js',
    'src/components/voteUrlProcessor/index.test.js',
    'src/store/middlewares/login.test.js',
    'src/store/reducers/liskService.test.js',
    '<rootDir>/test/integration/wallet.test.js',
  ],
  verbose: true,
  cache: false,
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
    'app/src/ipc.js',
    'app/src/ledger.js',
    'src/actions/liskService.js',
    'src/actions/peers.js', // FollowUp #1515
    'src/actions/peers.js', // FollowUp #1515
    'src/actions/transactions.js',
    'src/components/account/stories.js',
    'src/components/accountInitialization/index.js',
    'src/components/backgroundMaker/index.js',
    'src/components/dashboard/currencyGraph.js', // This should be unskipped in issue #1499
    'src/components/dialog/stories.js',
    'src/components/errorBoundary/index.js',
    'src/components/feedbackForm/',
    'src/components/formattedNumber/stories.js',
    'src/components/hwWallet/',
    'src/components/login/',
    'src/components/newsFeed/index.js', // This component doesn't meet the setted tresholds for mocha but in jest
    'src/components/newsFeed/news.js',
    'src/components/passphrase/create/create.js',
    'src/components/passphraseCreation/index.js',
    'src/components/passphraseSteps/index.js', // FollowUp #1515
    'src/components/passphraseSteps/index.js', // FollowUp #1515
    'src/components/request/index.js',
    'src/components/register/register.js',
    'src/components/resultBox/index.js',
    'src/components/resultBox/resultBox.js', // FollowUp #1515
    'src/components/resultBox/resultBox.js', // FollowUp #1515
    'src/components/searchBar/index.js', // Passing in mocha but not in Jest
    'src/components/send/steps/confirm/confirm.js', // FollowUp #1515
    'src/components/send/steps/form/stories.js',
    'src/components/spinner/stories.js',
    'src/components/toaster/stories.js',
    'src/components/toolbox/transitionWrapper/index.js',
    'src/components/transactionDashboard/index.js',
    'src/components/transactions/transactions.js',
    'src/components/transactions/votedDelegates.js',
    'src/components/transferTabs/index.js',
    'src/components/voteUrlProcessor/index.js',
    'src/constants/',
    'src/i18n-scanner.js',
    'src/main.js',
    'src/store/middlewares/login.js',
    'src/store/reducers/liskService.js',
    'src/tests.js',
    'src/utils/api/ledger.js',
    'src/utils/api/liskService.js',
    'src/utils/applyDeviceClass.js',
    'src/utils/ledger.js',
    'src/utils/proxyLogin.js',
    'src/utils/rawTransactionWrapper.js',
    'src/utils/to.js',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    'app/src/**/*.js': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/**/*.js': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/store/**/*.js': {
      statements: 90,
    },
  },
  setupFiles: [
    '<rootDir>/config/setupJest.js',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testURL: 'http://localhost',
  globals: {
    PRODUCTION: true,
    TEST: true,
  },
  coverageReporters: [
    'text',
    'html',
    'lcov',
    'cobertura',
  ],
  reporters: [
    'default',
    ['jest-junit', { suiteName: 'jest tests', outputDirectory: '<rootDir>/coverage/jest' }],
  ],
};
