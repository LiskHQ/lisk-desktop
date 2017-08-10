// load all tests into one bundle
var testsContext = require.context('.', true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);
