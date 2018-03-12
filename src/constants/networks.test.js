import { expect } from 'chai';
import { stub, mock } from 'sinon';

import * as env from './env';

/* eslint-disable mocha/no-exclusive-tests */
describe.only('Network constants', () => {
  let envTest;
  let networks;

  beforeEach(() => {
    envTest = stub(env, 'test');
  });

  afterEach(() => {
    envTest.restore();
  });

  it('default network should be testnet on test environment', () => {
    envTest.returns(true);
    networks = require('./networks');
    /* eslint-disable no-console */
    console.log('default-->', networks.default);
    /* eslint-enable no-console */
    expect(networks.default).to.be.deep.equal(networks.testnet);
  });

  it('default network should be mainnet on prod environment', () => {
    envTest.returns(false);
    networks = require('./networks');
    /* eslint-disable no-console */
    console.log('default-->', networks.default);
    /* eslint-enable no-console */
    expect(networks.default).to.be.deep.equal(networks.mainnet);
  });

  it('default network should be mainnet when no localStorage available', () => {
    envTest.returns(false);
    mock(window, { localStorage: false });
    /* eslint-disable no-console */
    console.log('default-->', networks.default);
    /* eslint-enable no-console */
    expect(networks.default).to.be.deep.equal(networks.mainnet);
  });
});
/* eslint-enable mocha/no-exclusive-tests */
