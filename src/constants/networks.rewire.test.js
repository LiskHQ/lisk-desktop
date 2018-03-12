import { expect } from 'chai';
import { stub, mock } from 'sinon';
import env from './env';

describe('Network constants', () => {

  beforeEach(() => {
    stub.reset();
  });

  it('default network should be testnet on test environment', () => {
    stub(env, { test: true });
    const networks = require('./networks');
    /* eslint-disable no-console */
    console.log('default-->', networks.defaultNetwork);
    /* eslint-enable no-console */
    expect(networks.defaultNetwork).to.be.deep.equal(networks.testnet);
  });

  it('default network should be mainnet on prod environment', () => {
    stub(env, { test: false });
    const networks = require('./networks');
    /* eslint-disable no-console */
    console.log('default-->', networks.defaultNetwork);
    /* eslint-enable no-console */
    expect(networks.defaultNetwork).to.be.deep.equal(networks.mainnet);
  });

  it('default network should be mainnet when no localStorage available', () => {
    stub(env, { test: false });
    mock(window, { localStorage: false });
    const networks = require('./networks');
    /* eslint-disable no-console */
    console.log('default-->', networks.defaultNetwork);
    /* eslint-enable no-console */
    expect(networks.defaultNetwork).to.be.deep.equal(networks.mainnet);
  });
});
