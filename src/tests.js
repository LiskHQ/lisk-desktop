// load all tests into one bundle
const testsContext = require.context('.', true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);
