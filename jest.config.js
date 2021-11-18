const { resolve } = require('path');

module.exports = {
  modulePaths: ['src/components'],
  testMatch: [
    '<rootDir>/app/src/**/*.test.js',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/test/integration/*.test.js',
    '<rootDir>/libs/**/*.test.js',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/test/integration/wallet.test.js',
    'src/components/login/*.test.js',
    'src/components/newsFeed/index.test.js', // This component doesn't meet the setted tresholds for mocha but in jest
    'src/components/screens/register/register.test.js',
    'src/components/screens/delegates/votingSummary/voteUrlProcessor/index.test.js',
    'src/store/reducers/liskService.test.js',
    'src/components/screens/register/register.test.js',
    'src/components/shared/header/signInHeader/signInHeader.test.js',
  ],
  verbose: false,
  moduleFileExtensions: ['js'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^.+\\.css$': 'identity-obj-proxy',
    '^@src(.*)$': resolve(__dirname, './src/$1'),
    '^@utils(.*)$': resolve(__dirname, './src/utils/$1'),
    '^@api(.*)$': resolve(__dirname, './src/utils/api/$1'),
    '^@constants$': resolve(__dirname, './src/constants'),
    '^@shared(.*)$': resolve(__dirname, './src/components/shared/$1'),
    '^@screens(.*)$': resolve(__dirname, './src/components/screens/$1'),
    '^@toolbox(.*)$': resolve(__dirname, './src/components/toolbox/$1'),
    '^@actions(.*)$': resolve(__dirname, './src/store/actions/$1'),
    '^@store(.*)$': resolve(__dirname, './src/store/$1'),
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/jest',
  collectCoverageFrom: ['src/**/*.js', 'app/src/**/*.js'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.test.js',
    '.stories.js',
    'app/src/ipc.js',
    'app/src/ledger.js',
    'app/src/utils.js',
    'app/src/hwManager.js',
    'app/src/trezor.js',
    'app/src/modules/win.js',
    'app/src/modules/localeHandler.js',
    'app/src/modules/storage.js',
    'src/utils/testHelpers.js',
    'src/constants/',
    'src/i18n-scanner.js',
    'src/main.js',
    'src/tests.js',
    '/app/src/modules/autoUpdater.js',
    'src/actions/settings.js',
    'src/actions/transactions.js',
    'src/actions/network/lsk.js',
    'src/store/index.js',
    'src/store/reducers/settings.js',
    'src/store/reducers/bookmarks.js',
    'src/store/reducers/network.js',
    'src/store/reducers/filters.js', // To be removed in #2175
    'src/store/middlewares/network.js',
    'src/store/middlewares/account.js',
    'src/components/screens/',
    'src/components/shared/errorBoundary/index.js',
    'src/components/shared/registerMultiStep/index.js',
    'src/components/shared/registerMultiStep/element.js',
    'src/components/shared/registerMultiStep/utils.js',
    'src/components/shared/registerMultiStep/navigator.js',
    'src/components/shared/registerMultiStep/navigatorButton.js',
    'src/components/toolbox/dialog/holder.js',
    'src/components/toolbox/dialog/link.js',
    'src/components/shared/navigationBars/topBar/networkSelector/networkSelector.js',
    'src/components/shared/customRoute/index.js',
    'src/components/shared/navigationBars/topBar/topBar.js',
    'src/components/shared/navigationBars/sideBar/index.js',
    'src/components/shared/navigationBars/topBar/navigationButtons.js',
    'src/components/shared/newReleaseDialog/index.js',
    'src/components/shared/transactionInfo/',
    'src/components/toolbox/pageLayout/index.js',
    'src/components/shared/formattedNumber/stories.js',
    'src/components/shared/header/signInHeader/signInHeader.js',
    'src/components/shared/accountVisualWithAddress/index.js',
    'src/components/shared/voteWeight/index.js',
    'src/components/shared/transactionTypeFigure/index.js',
    'src/components/shared/filterDropdownButton/textFilter.js',
    'src/components/shared/transactionAmount/index.js',
    'src/components/shared/searchBar/transactions.js',
    'src/components/shared/navigationBars/topBar/networkName.js',
    'src/components/shared/multisignatureMembers/index.js',
    'src/components/shared/warnPunishedDelegate/warnPunishedDelegate.js',
    'src/components/shared/warnPunishedDelegate/index.js',
    'src/components/shared/warnPunishedDelegate/voteWarning.js',
    'src/components/toolbox/tabsContainer/tabsContainer.js',
    'src/components/toolbox/copyToClipboard/index.js',
    'src/components/toolbox/dropdown/toolBoxDropdown.js',
    'src/components/toolbox/hardwareWalletIllustration/index.js',
    'src/components/toolbox/switcher/index.js',
    'src/components/toolbox/demo.js',
    'src/components/toolbox/animation/demo.js',
    'src/components/toolbox/calendar/demo.js',
    'src/components/toolbox/hardwareWalletIllustration/demo.js',
    'src/components/toolbox/illustration/demo.js',
    'src/components/toolbox/onboarding/demo.js',
    'src/components/toolbox/pageHeader/demo.js',
    'src/components/toolbox/pageHeader/index.js',
    'src/components/toolbox/passphraseInput/demo.js',
    'src/components/toolbox/spinner/demo.js',
    'src/components/toolbox/switcher/demo.js',
    'src/components/toolbox/demoRenderer.js',
    'src/components/toolbox/table/empty.js',
    'src/components/toolbox/table/header.js',
    'src/components/toolbox/timestamp/index.js',
    'src/utils/localJSONStorage.js',
    'src/utils/analytics.js',
    'src/utils/bookmarks.js',
    'src/utils/api/ledger.js',
    'src/utils/api/btc/',
    'src/utils/api/delegates.js',
    'src/utils/api/lsk/adapters.js',
    'src/utils/api/lsk/account.js',
    'src/utils/applyDeviceClass.js',
    'src/utils/ledger.js',
    'src/utils/theme.js',
    'src/utils/balanceChart.js', // This should be unskipped in issue #1499
    'src/utils/loading.js',
    'src/utils/platform.js',
    'src/utils/hwManager.js',
    'src/utils/api/ws.js',
    'src/utils/account.js',
    'src/utils/datetime.js',
    'src/hooks/useServiceSocketUpdates.js',
    'src/utils/api/apiClient.js',
    'src/utils/api/transaction/btc.js',
    'src/utils/api/network/lsk.js',
    'src/utils/api/network/btc.js',
    'src/utils/api/market/index.js',
    'src/components/shared/walletDetails/walletDetails.js',
    'src/utils/login.js',
    'src/components/shared/transactionResult/index.js',
    'src/utils/api/search/lsk.js',
    'src/utils/api/search/btc.js',
    'src/utils/api/account/btc.js',
    'src/components/shared/navigationBars/topBar/toggle.js',
    'src/components/shared/navigationBars/topBar/tokenSelector.js',
    'src/store/middlewares/block.js',
    'src/utils/getNetwork.js',
    'src/utils/api/block/index.js',
    'src/utils/api/transaction/lsk.js',
    'src/utils/transaction.js',
    'src/components/shared/filterDropdownButton/addressFilter.js',
    'src/components/shared/transactionsTable/transactionRow.js',
    'src/store/selectors.js',
    'src/components/shared/transactionSummary/index.js',
    'src/routes.js',
    'src/store/selectors.js',
    'src/store/reducers/voting.js',
    'src/utils/voting.js',
    'src/utils/getNetwork.js',
    'src/components/shared/transactionResult/statusConfig.js',
    'src/components/shared/transactionResult/ordinary.js',
    'src/components/shared/transactionResult/multisignature.js',
    'src/components/shared/transactionResult/transactionResult.js',
    'src/components/shared/transactionSummary/transactionSummary.js',
    'src/components/shared/transactionSignature/transactionSignature.js',
    'src/components/shared/voteItem/index.js',
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
  setupFiles: ['<rootDir>/config/setupJest.js', 'jest-canvas-mock'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testURL: 'http://localhost',
  globals: {
    PRODUCTION: true,
    TEST: true,
    VERSION: '',
  },
  coverageReporters: process.env.ON_JENKINS
    ? ['text', 'lcov', 'cobertura']
    : ['html', 'json'],
  reporters: [
    'default',
    [
      'jest-junit',
      { suiteName: 'jest tests', outputDirectory: '<rootDir>/coverage/jest' },
    ],
  ],
  setupFilesAfterEnv: ['./node_modules/jest-enzyme/lib/index.js'],
  testEnvironment: 'enzyme',
  watchPlugins: [
    ['jest-watch-toggle-config', { setting: 'verbose' }],
    ['jest-watch-toggle-config', { setting: 'collectCoverage' }],
    'jest-watch-typeahead/filename',
  ],
};
