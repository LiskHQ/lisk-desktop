import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import Setting from './setting';
import accounts from '../../../test/constants/accounts';
import settingsConst from './../../constants/settings';

describe('Setting', () => {
  const settings = {
    autoLog: true,
    showNetwork: false,
    currency: undefined,
    statistics: false,
    token: {
      list: {
        BTC: true,
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
        username: 'lisk-hub',
      },
    },
  };
  const store = configureMockStore([])({
    account,
    liskAPIClientSet: jest.fn(),
    settings,
  });

  const options = {
    context: { store },
    childContextTypes: {
      store: PropTypes.object.isRequired,
    },
  };

  const t = key => key;
  let wrapper;

  const props = {
    account: {},
    settingsUpdated: jest.fn(),
    accountUpdated: jest.fn(),
    settings,
    t,
    isAuthenticated: true,
    location: {
      pathname: '/setting',
    },
    toastDisplayed: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Router>
      <Setting {...props} store={store}/>
    </Router>, options);
  });

  it('should disable 2nd passphrase when hardwareWallet', () => {
    const newProps = { ...props, account: { hwInfo: { deviceId: '123' } } };
    wrapper = mount(<Router>
      <Setting {...newProps} store={store}/>
    </Router>, options);
    expect(wrapper).toContainMatchingElements(3, '.disabled');
  });

  it('should render 2nd passphrase as active', () => {
    const account2ndPassphrase = { info: { LSK: accounts['second passphrase account'] } };
    const newProps = { ...props, account: account2ndPassphrase, hasSecondPassphrase: true };
    wrapper = mount(<Router>
      <Setting {...newProps}/>
    </Router>, options);
    expect(wrapper.find('.second-passphrase')).not.toContainMatchingElement('.link');
    expect(wrapper.find('.second-passphrase')).toContainMatchingElement('.activeLabel');
  });

  it('should change autolog setting when clicking on checkbox', () => {
    wrapper.find('.autoLog input').at(0).simulate('change', { target: { name: 'autoLog' } });
    const expectedCallToSettingsUpdated = {
      autoLog: !settings.autoLog,
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
    wrapper.find('.currency .options span').at(1).simulate('click', { target: { dataset: { index: 1 } } });
    const expectedCallToSettingsUpdated = {
      currency: settingsConst.currencies[1],
    };
    expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  });

  it('should update expireTime when updating autolog', () => {
    const accountToExpireTime = { ...account };
    const settingsToExpireTime = { ...settings };
    settingsToExpireTime.autoLog = false;
    accountToExpireTime.passphrase = accounts.genesis.passphrase;
    wrapper = mount(<Router>
      <Setting
        {...props}
        store={store}
        account={accountToExpireTime}
        settings={settingsToExpireTime}
      />
    </Router>, options);

    wrapper.find('.autoLog input').at(0).simulate('change', { target: { name: 'autoLog' } });

    const timeNow = Date.now();
    const expectedCallToAccountUpdated = {
      expireTime: timeNow,
    };
    expect(props.accountUpdated).toBeCalled();
    expect(props.accountUpdated.mock.calls[0][0].expireTime)
      .toBeGreaterThan(expectedCallToAccountUpdated.expireTime);
  });

  // TODO Unskip after enabling BTC
  it.skip('should enable and disable BTC token', () => {
    localStorage.setItem('btc', true);
    wrapper.find('.enableBTC input').at(0).simulate('change', { target: { name: 'BTC' } });
    const expectedCallToSettingsUpdated = {
      token: { list: { BTC: !settings.token.list.BTC } },
    };
    expect(props.settingsUpdated).toBeCalledWith(expectedCallToSettingsUpdated);
  });
});
