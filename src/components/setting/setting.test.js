import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import Setting from './setting';
import i18n from '../../i18n';

/* eslint-disable mocha/no-exclusive-tests */
describe.only('Setting', () => {
  const history = {
    location: {
      pathname: '/main/voting',
    },
    push: sinon.spy(),
  };
  const settings = {
    autoLog: true,
    advancedMode: true,
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
  const settingsUpdated = sinon.spy();

  beforeEach(() => {
    wrapper = mount(<MemoryRouter>
      <Setting store={store} settingsUpdated={settingsUpdated} settings={settings} t={t}/>
    </MemoryRouter>, options);
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
    i18n.changeLanguage('en');
  });

  it('should render "ReactSwipe" component', () => {
    expect(wrapper.find('ReactSwipe').exists()).to.equal(true);
  });

  it('should click on #carouselNav li change the slider', () => {
    wrapper.find('#carouselNav li').at(1).simulate('click');
    wrapper.update();
    clock.tick(500);
    wrapper.update();
    expect(wrapper.find('#carouselNav li').at(1).props().className).to.be.include('activeSlide');
  });

  it('should change advanceMode setting when clicking on checkbox', () => {
    wrapper.find('.advancedMode').at(0).simulate('change');
    wrapper.update();
    clock.tick(500);
    wrapper.update();
    const expectedCallToSettingsUpdated = {
      advancedMode: !settings.advancedMode,
    };
    expect(settingsUpdated).to.have.been.calledWith(expectedCallToSettingsUpdated);
  });

  it.skip('should click on .autoLog update the setting', () => {
    wrapper.find('.autoLog input').simulate('click');
    clock.tick(100);
    wrapper.find('.autoLog label').simulate('click');
    wrapper.update();
    clock.tick(500);
    wrapper.update();

    expect(settingsUpdated).to.have.been.calledOnce();
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
/* eslint-enable mocha/no-exclusive-tests */
