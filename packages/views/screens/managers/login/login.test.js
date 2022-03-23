import React from 'react';
import i18next from 'i18next';
import { mount } from 'enzyme';
import { useDispatch } from 'react-redux';
import { mountWithRouterAndStore } from '@common/utilities/testHelpers';
import { routes } from '@common/configuration';
import { defaultDerivationPath } from '@common/utilities/explicitBipKeyDerivation';
import { settingsUpdated } from '@common/store/actions';
import Login from './login';
import accounts from '../../../../test/constants/accounts';

jest.mock('@basics/flashMessage/holder', () => ({
  addMessage: jest.fn(),
  deleteMessage: jest.fn(),
}));

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
        serviceUrl: '',
      },
    },
  };

  const settings = {
    areTermsOfUseAccepted: false,
    token: {
      active: 'LSK',
      list: {
        LSK: true,
        BTC: false,
      },
    },
  };

  let props;

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

  const { passphrase } = accounts.genesis;

  beforeEach(() => {
    jest.restoreAllMocks();
    props = {
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
        account: { summary: { address: 'dummy' } },
      });
      expect(props.history.replace).toHaveBeenCalledWith(`${routes.dashboard.path}`);
    });

    it('calls this.props.history.replace with referrer address', () => {
      history.location.search = `?referrer=${routes.wallet.path}`;
      wrapper.setProps({
        history, account: { summary: { address: 'dummy' } },
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
      wrapper.find('button.login-button').simulate('submit');
      expect(props.login).toHaveBeenCalledWith({
        passphrase: accounts.delegate.passphrase,
      });
    });

    it('should not login if passphrase is empty', () => {
      const clipboardData = {
        getData: () => '',
      };
      wrapper.find('passphraseInput input').first().simulate('paste', { clipboardData });
      wrapper.update();
      wrapper.find('button.login-button').simulate('submit');
      expect(props.login).not.toHaveBeenCalled();
    });
  });

  describe('Recovery phrase mode', () => {
    it('Should not display custom derivation path', () => {
      wrapper = mountWithRouterAndStore(
        Login, props, {}, {
          settings: {
            enableCustomDerivationPath: false,
            customDerivationPath: defaultDerivationPath,
          },
        },
      );
      expect(wrapper.find('.custom-derivation-path-input').exists()).toBeFalsy();
    });

    it('Should display custom derivation path and dispatch settings updated action', () => {
      const mockDispatch = jest.fn();
      useDispatch.mockReturnValue(mockDispatch);
      wrapper = mountWithRouterAndStore(
        Login, props, {}, {
          settings: {
            enableCustomDerivationPath: true,
            customDerivationPath: defaultDerivationPath,
          },
        },
      );

      expect(wrapper.find('.custom-derivation-path-input').at(1).props().value).toBe(defaultDerivationPath);
      wrapper.find('.custom-derivation-path-input').at(1).simulate('change', { target: { value: "m/44'/134'/1'" } });
      wrapper.update();
      expect(mockDispatch).toHaveBeenCalledWith(settingsUpdated({ customDerivationPath: "m/44'/134'/1'" }));
    });
  });
});
