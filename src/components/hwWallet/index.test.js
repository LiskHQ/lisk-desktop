import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { stub, useFakeTimers, spy } from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import HwWalletHOC from './index';
import HwWallet from './hwWallet';
import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLoginHOC';
import * as ledgerUtils from '../../utils/ledger';

import networks from '../../constants/networks';
import routes from '../../constants/routes';

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

  const history = {
    location: {
      pathname: '',
      search: '',
    },
    push: spy(),
    replace: spy(),
  };

  const options = {
    context: { store, i18n, router: { route: history, history } },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  let wrapper;
  let clock;
  let getAccountFromLedgerIndexStub;

  describe('account with publicKey', () => {
    beforeEach(() => {
      getAccountFromLedgerIndexStub = stub(ledgerUtils, 'getAccountFromLedgerIndex').returnsPromise().resolves({
        balance: 10e8,
        isDelegate: false,
        publicKey: '123112',
      });

      clock = useFakeTimers({
        toFake: ['setTimeout'],
      });

      wrapper = mount(
        <MemoryRouter><HwWalletHOC /></MemoryRouter>,
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

    it('should render LedgerLogin component with publicKey while being on customNetwork', () => {
      wrapper.setState({ network: networks.customNode.code });
      wrapper.update();
      expect(wrapper.find(LedgerLogin).exists()).to.equal(true);
    });
  });

  describe('account without publicKey', () => {
    let props;

    beforeEach(() => {
      getAccountFromLedgerIndexStub = stub(ledgerUtils, 'getAccountFromLedgerIndex').returnsPromise().resolves({
        balance: 10e8,
        isDelegate: false,
      });

      clock = useFakeTimers({
        toFake: ['setTimeout'],
      });

      props = {
        history,
      };

      wrapper = shallow(<HwWallet {...props}/>, options);
    });

    afterEach(() => {
      getAccountFromLedgerIndexStub.restore();
    });

    it('should render LedgerLogin after clicking cancelLedgerLogin', async () => {
      expect(wrapper.find(LedgerLogin).exists()).to.equal(true);
      wrapper.find(LedgerLogin).props().cancelLedgerLogin();

      expect(props.history.push).to.be.calledWith(routes.loginV2.path);
    });
  });
});
