import React from 'react';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import LoginV2 from './loginV2';
import accounts from '../../../test/constants/accounts';
import routes from '../../constants/routes';

describe('LoginV2', () => {
  let wrapper;
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-hub',
  };
  const peers = {
    data: {},
    options: {},
  };

  const settings = {
    areTermsOfUseAccepted: false,
  };

  const store = configureMockStore([])({
    peers,
    account,
    settings,
  });
  const history = {
    location: {
      pathname: '',
      search: '',
    },
    push: spy(),
    replace: spy(),
  };

  const props = {
    peers,
    account,
    history,
    accountsRetrieved: spy(),
    t: data => data,
    onAccountUpdated: () => {},
    liskAPIClientSet: spy(),
    settingsUpdated: spy(),
    settings,
  };

  const options = {
    context: {
      store, history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
    lifecycleExperimental: true,
  };

  const { passphrase } = accounts.genesis;
  let localStorageStub;

  beforeEach(() => {
    localStorageStub = stub(localStorage, 'getItem');
    localStorageStub.withArgs('showNetwork').returns(JSON.stringify(undefined));

    wrapper = mount(<MemoryRouter><LoginV2 {...props}/></MemoryRouter>, options);
  });

  afterEach(() => {
    history.location.search = '';
    localStorageStub.restore();
  });

  describe('Generals', () => {
    it('redirect to Terms of Use page', () => {
      expect(props.history.push).to.have.been.calledWith(`${routes.termsOfUse.path}`);
    });

    it('should show error about passphrase length if passphrase have wrong length', () => {
      const expectedError = 'Passphrase should have 12 words, entered passphrase has 11';
      const lastIndex = passphrase.lastIndexOf(' ');
      const clipboardData = {
        getData: () => passphrase.substring(0, lastIndex),
      };
      wrapper.find('passphraseInputV2 input').first().simulate('paste', { clipboardData });
      expect(wrapper.find('passphraseInputV2 .errorMessage')).to.contain(expectedError);
    });

    it('Should show the address input when custom node is selected', () => {
      history.location.search = '?showNetwork=true';
      wrapper.setProps({ history });
      wrapper.find('HeaderV2 .option').at(2).simulate('click');
      expect(wrapper.find('.customNode')).to.have.className('showInput');
    });

    it('Should show error message and put error style on custom node input', () => {
      const customNode = wrapper.find('.customNode');
      history.location.search = '?showNetwork=true';
      wrapper.setProps({ history });
      wrapper.find('HeaderV2 .option').at(2).simulate('click');
      expect(customNode.find('.errorMessage')).to.not.have.className('showError');
      customNode.find('input').simulate('change', { target: { value: 'localhost' } });
      expect(customNode.find('.errorMessage')).to.have.className('showError');
      customNode.find('input').simulate('change', { target: { value: 'localhost:4000' } });
      expect(customNode.find('.errorMessage')).to.not.have.className('showError');
    });

    it('Should show hardware login if hardware is connected and should go to hwWallet on click', () => {
      wrapper.setProps({
        children: React.cloneElement(wrapper.props().children, {
          settings: { isHarwareWalletConnected: true },
        }),
      });
      expect(wrapper).to.have.exactly(1).descendants('.hardwareHolder');
      wrapper.find('.hardwareWalletLink').simulate('click');
      expect(props.history.push).to.have.been.calledWith(`${routes.hwWallet.path}`);
    });
  });

  describe('History management', () => {
    it('calls this.props.history.replace(\'/dashboard\')', () => {
      wrapper.setProps({
        history,
        children: React.cloneElement(wrapper.props().children, {
          account: { address: 'dummy' },
        }),
      });
      expect(props.history.replace).to.have.been.calledWith(`${routes.dashboard.path}`);
    });

    it('calls this.props.history.replace with referrer address', () => {
      props.history.replace.reset();
      history.location.search = `?referrer=${routes.delegates.path}`;
      wrapper.setProps({
        children: React.cloneElement(wrapper.props().children, {
          history, account: { address: 'dummy' },
        }),
      });
      expect(props.history.replace).to.have.been.calledWith(`${routes.delegates.path}`);
    });

    it('hides network options by default', () => {
      props.history.replace.reset();
      wrapper.setProps({ history });
      expect(wrapper.find('HeaderV2')).to.not.have.prop('showNetwork');
    });

    it('shows network options when url param showNetwork is true', () => {
      props.history.replace.reset();
      history.location.search = '?showNetwork=true';
      wrapper.setProps({ history });
      expect(wrapper.find('HeaderV2')).to.have.prop('showNetwork');
    });
  });

  describe('After submission', () => {
    it('it should call liskAPIClientSet if not already logged with given passphrase', () => {
      wrapper.find('passphraseInputV2 input').first().simulate('change', { target: { value: passphrase, dataset: { index: 0 } } });
      wrapper.update();
      wrapper.find('form').simulate('submit');
      expect(props.liskAPIClientSet).to.have.been.calledWith();
    });
  });
});
