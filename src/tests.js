import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.use(chaiAsPromised);
sinonStubPromise(sinon);
/* istanbul ignore next */
window.localStorage.getItem = () => JSON.stringify([]);
const testsContext = require.context('.', true, /\.test\.js$/);
testsContext.keys().filter(url => url.indexOf('/src/components/passphrase/') > -1).forEach(testsContext);

// const integrationContext = require.context('../test/integration/', true, /\.test\.js$/);
// integrationContext.keys().forEach(integrationContext);

// const electronTestsContext = require.context('../app', true, /\.test\.js$/);
// electronTestsContext.keys().forEach(electronTestsContext);
