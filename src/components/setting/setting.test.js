import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import { MemoryRouter as Router } from 'react-router-dom';
import Setting from './setting';
import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import breakpoints from './../../constants/breakpoints';

describe('Setting', () => {
  const history = {
    location: {
      pathname: '/delegates',
    },
    push: sinon.spy(),
  };
  const settings = {
    autoLog: true,
    advancedMode: true,
    showNetwork: false,
  };

  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-hub',
  };
  const store = configureMockStore([])({
    account,
    activePeerSet: () => {},
    settings,
  });

  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };


  let clock;
  const t = key => key;
  let wrapper;

  const props = {
    settingsUpdated: sinon.spy(),
    accountUpdated: sinon.spy(),
    settings,
    t,
    toggleMenu: sinon.spy(),
    isAuthenticated: true,
  };

  beforeEach(() => {
    window.innerWidth = breakpoints.l;

    wrapper = mount(<Router>
      <Setting
        store={store}
        {...props}/>
    </Router>, options);

    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
    // i18n.changeLanguage('en');
  });

  it('should change advanceMode setting when clicking on checkbox', () => {
    wrapper.find('.advancedMode').at(0).find('input').simulate('change', { target: { checked: false, value: false } });
    clock.tick(300);
  });

  it('should show the onboarding setting when authenticated and not on mobile', () => {
    wrapper.find('button').props().onClick();
    expect(props.settingsUpdated).to.have.been.calledWith();
  });

  it('should not show the onboarding setting when on mobile', () => {
    window.innerWidth = breakpoints.m;
    wrapper = mount(<Router>
      <Setting
        {...props}
      />
    </Router>, options);
    expect(wrapper.find('.onBoarding')).to.have.length(0);
  });

  it('should show the onboarding setting when not authenticated', () => {
    props.isAuthenticated = false;
    wrapper = mount(<Router>
      <Setting
        {...props}
      />
    </Router>, options);
    expect(wrapper.find('.onBoarding')).to.have.length(1);
  });

  it.skip('should click on .autoLog update the setting', () => {
    wrapper.find('.autoLog input').simulate('click');
    clock.tick(100);
    wrapper.find('.autoLog label').simulate('click');
    wrapper.update();
    const expectedCallToSettingsUpdated = {
      advancedMode: !settings.advancedMode,
    };
    expect(props.settingsUpdated).to.have.been.calledWith(expectedCallToSettingsUpdated);
  });

  it('should change autolog setting when clicking on checkbox', () => {
    wrapper.find('.autoLog').at(0).find('input').simulate('change', { target: { checked: false, value: false } });
    clock.tick(300);
    wrapper.update();
    const expectedCallToSettingsUpdated = {
      autoLog: !settings.autoLog,
    };
    expect(props.settingsUpdated).to.have.been.calledWith(expectedCallToSettingsUpdated);
  });

  it('should change showNetwork setting when clicking on checkbox', () => {
    wrapper.find('.showNetwork').at(0).find('input').simulate('change', { target: { checked: true, value: true } });
    clock.tick(300);
    wrapper.update();
    const expectedCallToSettingsUpdated = {
      showNetwork: !settings.showNetwork,
    };
    expect(props.settingsUpdated).to.have.been.calledWith(expectedCallToSettingsUpdated);
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

    wrapper.find('.autoLog').at(0).find('input').simulate('change', { target: { checked: true, value: true } });
    clock.tick(300);
    wrapper.update();

    const timeNow = Date.now();
    const expectedCallToAccountUpdated = {
      expireTime: timeNow,
    };
    expect(props.accountUpdated.getCall(0).args[0].expireTime)
      .to.be.greaterThan(expectedCallToAccountUpdated.expireTime);
  });

  // TODO: will be re-enabled when the functionality is re-enabled
  it.skip('should click on "languageSwitcher" change the language to "de"', () => {
    // const languageSpy = sinon.spy(i18n, 'changeLanguage');
    wrapper.find('.language-switcher .circle').simulate('click');
    wrapper.update();
    expect(i18n.language).to.be.equal('de');
  });

  // TODO: will be re-enabled when the functionality is re-enabled
  it.skip('should second click on "languageSwitcher" change the language to "en"', () => {
    wrapper.find('.language-switcher .circle').simulate('click');
    wrapper.update();
    expect(i18n.language).to.be.equal('de');
    wrapper.find('.language-switcher .circle').simulate('click');
    wrapper.update();
    expect(i18n.language).to.be.equal('en');
  });
});
