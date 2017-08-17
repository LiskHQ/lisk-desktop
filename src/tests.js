import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.use(chaiAsPromised);

// load all tests into one bundle
const testsContext = require.context('.', true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);
