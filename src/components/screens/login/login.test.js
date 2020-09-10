import React from 'react';
import i18next from 'i18next';
import { mount } from 'enzyme';
import Login from './login';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';

describe('Login', () => {
  let wrapper;
  i18next.on = jest.fn();

  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-desktop',
  };

  const network = {
    status: { online: true },
    name: 'Custom Node',
    networks: {
      LSK: {
        nodeUrl: 'hhtp://localhost:4000',
        nethash: '2349jih34',
      },
    },
  };

  const settings = {
    areTermsOfUseAccepted: false,
    token: {
      active: 'LSK',
      list: {
        LSK: true,
        BTC: true,
      },
    },
  };

  const history = {
    location: {
      pathname: '',
      search: '',
    },
    push: jest.fn(),
    replace: jest.fn(),
  };

  const match = {
    url: routes.login.path,
  };

  const props = {
    network,
    match,
    account,
    history,
    settings,
    t: data => data,
    login: jest.fn(),
    onAccountUpdated: jest.fn(),
    accountsRetrieved: jest.fn(),
    settingsUpdated: jest.fn(),
    liskAPIClient: jest.fn(),
  };

  const { passphrase } = accounts.genesis;

  beforeEach(() => {
    localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(undefined));
    wrapper = mount(<Login {...props} />);
  });

  afterEach(() => {
    history.location.search = '';
  });

  describe('Generals', () => {
    it('redirect to Terms of Use page', () => {
      expect(props.history.push).toHaveBeenCalledWith(routes.termsOfUse.path);
    });

    it('should show error about passphrase length if passphrase have wrong length', () => {
      const expectedError = 'Passphrase should have 12 words, entered passphrase has 11';
      const clipboardData = {
        getData: () => passphrase.replace(/\s[a-z]+$/, ''),
      };
      wrapper.find('passphraseInput input').first().simulate('paste', { clipboardData });
      expect(wrapper.find('passphraseInput Feedback').last().html()).toContain(expectedError);
    });
  });

  describe('History management', () => {
    it('calls this.props.history.replace(\'/dashboard\')', () => {
      wrapper.setProps({
        history,
        account: { address: 'dummy' },
      });
      expect(props.history.replace).toHaveBeenCalledWith(`${routes.dashboard.path}`);
    });

    it('calls this.props.history.replace with referrer address', () => {
      history.location.search = `?referrer=${routes.wallet.path}`;
      wrapper.setProps({
        history, account: { address: 'dummy' },
      });
      expect(props.history.replace).toHaveBeenCalledWith(routes.wallet.path);
    });
  });

  describe('After submission', () => {
    it('it should call props.login if not already logged with given passphrase', () => {
      const clipboardData = {
        getData: () => accounts.delegate.passphrase,
      };
      wrapper.find('passphraseInput input').first().simulate('paste', { clipboardData });
      wrapper.update();
      wrapper.find('button.login-button').simulate('click');
      expect(props.login).toHaveBeenCalled();
    });
  });
});
