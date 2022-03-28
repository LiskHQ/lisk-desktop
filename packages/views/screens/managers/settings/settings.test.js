/* eslint-disable */
import React from 'react';
import Settings from './settings';
import accounts from '../../../../../tests/constants/accounts';
import { mountWithRouter } from '@common/utilities/testHelpers';

describe('Setting', () => {
  const settings = {
    autoLog: true,
    showNetwork: false,
    currency: undefined,
    statistics: false,
    discreetMode: false,
    token: {
      list: {
        BTC: false,
        LSK: true,
      },
      active: 'LSK',
    },
  };

  const account = {
    info: {
      LSK: {
        ...accounts.genesis,
        isDelegate: false,
        username: 'lisk-desktop',
      },
    },
  };

  const t = key => key;
  let wrapper;

  const props = {
    transactions: { pending: [] },
    account: { token: 'LSK', passphrase: 'sample_passphrase' },
    timerReset: jest.fn(),
    settingsUpdated: jest.fn(),
    settings,
    t,
    isAuthenticated: true,
    location: {
      pathname: '/settings',
    },
  };

  describe('With no transaction in guest mode', () => {
    beforeEach(() => {
      wrapper = mountWithRouter(Settings, props);
    });

    it('should change autolog setting when clicking on checkbox', () => {
      wrapper.find('.autoLog input').at(0).simulate('change', { target: { name: 'autoLog' } });
      expect(props.timerReset).toBeCalled();
    });

    it('should change discreet mode setting when clicking on checkbox', () => {
      wrapper.find('.discreetMode input').at(0).simulate('change', { target: { name: 'discreetMode' } });
      const expectedCallToSettingsUpdated = {
        discreetMode: !settings.discreetMode,
      };
      expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
    });

    it('should change showNetwork setting when clicking on checkbox', () => {
      wrapper.find('.showNetwork input').at(0).simulate('change', { target: { name: 'showNetwork' } });
      const expectedCallToSettingsUpdated = {
        showNetwork: !settings.showNetwork,
      };
      expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
    });

    it('should change usage statistics when clicking on checkbox', () => {
      wrapper.find('.statistics input').at(0).simulate('change', { target: { name: 'statistics' } });
      const expectedCallToSettingsUpdated = {
        statistics: !settings.statistics,
      };
      expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
    });

    it('should change active currency setting to EUR', () => {
      wrapper.find('.currency input').simulate('focus');
      wrapper.find('.currency .options span').at(1).simulate('click', { target: { getAttribute: () => 'EUR' } });
      const expectedCallToSettingsUpdated = {
        currency: 'EUR',
      };
      expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
    });
  });

  describe('With specific properties', () => {
    it('should update expireTime when updating autolog', () => {
      const accountToExpireTime = { ...account };
      const settingsToExpireTime = { ...settings };
      settingsToExpireTime.autoLog = false;
      accountToExpireTime.passphrase = accounts.genesis.passphrase;
      wrapper = mountWithRouter(Settings, { ...props, account: accountToExpireTime, settings: settingsToExpireTime });

      wrapper.find('.autoLog input').at(0).simulate('change', { target: { name: 'autoLog' } });

      expect(props.timerReset).toBeCalled();
    });
  });
});
