import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, useFakeTimers } from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import HwWalletHOC from './index';
import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLogin';
import * as ledgerUtils from '../../utils/ledger';

import networks from '../../constants/networks';
// import { loginType } from '../../constants/hwConstants';

describe('HwWalletHOC', () => {
  const store = configureMockStore([])({
    peers: {},
    account: {},
    settings: { network: networks.mainnet.code },
    liskAPIClient: {},
    liskAPIClientSet: () => {},
    loadingFinished: () => {},
    loadingStarted: () => {},
  });
  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };
  let wrapper;
  let clock;
  let getAccountFromLedgerIndexStub;

  beforeEach(() => {
    getAccountFromLedgerIndexStub = stub(ledgerUtils, 'getAccountFromLedgerIndex').returnsPromise().resolves({
      balance: 10e8,
      isDelegate: false,
    });

    clock = useFakeTimers({
      toFake: ['setTimeout'],
    });

    wrapper = mount(
      <MemoryRouter><HwWalletHOC store={store}/></MemoryRouter>,
      options,
    );
  });

  afterEach(() => {
    getAccountFromLedgerIndexStub.restore();
  });

  it('should mount HwWallet', () => {
    expect(wrapper).to.have.descendants('HwWallet');
  });

  it('should mount HwWallet with appropriate properties', () => {
    const props = wrapper.find('HwWallet').props();
    expect(props.network).to.be.equal(networks.mainnet.code);
    expect(typeof props.liskAPIClientSet).to.be.equal('function');
    expect(typeof props.loadingStarted).to.be.equal('function');
    expect(typeof props.loadingFinished).to.be.equal('function');
  });

  it('should render LedgerLogin component', () => {
    expect(wrapper.find(LedgerLogin).exists()).to.equal(true);
  });

  it('should render UnlockWallet component after 6 sec timeout', () => {
    wrapper.update();
    clock.tick(70000);
    wrapper.update();
    expect(wrapper.find(UnlockWallet).exists()).to.equal(true);
  });

  it('should render LedgerLogin component with publicKey', () => {
    getAccountFromLedgerIndexStub.restore();
    getAccountFromLedgerIndexStub = stub(ledgerUtils, 'getAccountFromLedgerIndex').returnsPromise().resolves({
      balance: 10e8,
      isDelegate: false,
      publicKey: '123112',
    });
    wrapper.update();
    expect(wrapper.find(LedgerLogin).exists()).to.equal(true);
  });

  it('should render LedgerLogin after clicking cancelLedgerLogin', async () => {
    getAccountFromLedgerIndexStub.restore();
    getAccountFromLedgerIndexStub = await stub(ledgerUtils, 'getAccountFromLedgerIndex')
      .returnsPromise().resolves({
        balance: 10e8,
        isDelegate: false,
        publicKey: '123112',
      });
    expect(wrapper.find(LedgerLogin).exists()).to.equal(true);
    wrapper.find(LedgerLogin).props().cancelLedgerLogin();
    wrapper.update();
    expect(wrapper.find(LedgerLogin).exists()).to.equal(false);
  });
});
