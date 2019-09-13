import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import i18n from '../i18n';
import analyticsUtil from './analytics';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import DialogHolder from '../components/toolbox/dialog/holder';

describe('Analytics Util', () => {
  const props = {
    settings: { statistics: false },
    t: k => k,
    settingsUpdated: jest.fn(),
    toastDisplayed: jest.fn(),
  };

  const store = configureMockStore()({
    settings: { statistics: false },
    settingsUpdated: jest.fn(),
    toastDisplayed: jest.fn(),
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    store.dispatch = jest.fn();
  });

  afterEach(() => {
    store.dispatch.mockRestore();
  });

  it('Should call FlashMessageHolder.addMessage', () => {
    const wrapper = mount(<FlashMessageHolder />, options);
    const dialogWrapper = mount(<DialogHolder {...props} />, options);
    expect(wrapper).toBeEmptyRender();
    expect(dialogWrapper).toBeEmptyRender();
    analyticsUtil.init();
    wrapper.update();
    expect(wrapper).toIncludeText('Opt-in to sharing anonymous data in order to improve Lisk Hub.');
    wrapper.find('a.url-link').simulate('click');
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('Anonymous Data Collection');
  });

  it('Should call FlashMessageHolder.addMessage when showAnalytics is set', () => {
    const wrapper = mount(<FlashMessageHolder />, options);
    const dialogWrapper = mount(<DialogHolder {...props} />, options);
    expect(wrapper).toBeEmptyRender();
    expect(dialogWrapper).toBeEmptyRender();
    analyticsUtil.checkIfAnalyticsShouldBeDisplayed({
      settings: props.settings, showAnalytics: true,
    });
    wrapper.update();
    expect(wrapper).toIncludeText('Opt-in to sharing anonymous data in order to improve Lisk Hub.');
    wrapper.find('a.url-link').simulate('click');
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('Anonymous Data Collection');
  });

  it('Should call FlashMessageHolder.addMessage after use saw the banner for first time', () => {
    const newSettings = {
      ...props.settings,
      statisticsRequest: true,
    };
    const wrapper = mount(<FlashMessageHolder />, options);
    const dialogWrapper = mount(<DialogHolder {...props} />, options);
    expect(wrapper).toBeEmptyRender();
    expect(dialogWrapper).toBeEmptyRender();
    analyticsUtil.checkIfAnalyticsShouldBeDisplayed({
      settings: newSettings, showAnalytics: false,
    });
    wrapper.update();
    expect(wrapper).toIncludeText('Opt-in to sharing anonymous data in order to improve Lisk Hub.');
    wrapper.find('a.url-link').simulate('click');
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('Anonymous Data Collection');
  });

  it('Should call FlashMessageHolder.addMessage after app runs', () => {
    const newSettings = {
      ...props.settings,
      statisticsRequest: true,
      statisticsFollowingDay: 240,
    };
    const wrapper = mount(<FlashMessageHolder />, options);
    const dialogWrapper = mount(<DialogHolder {...props} />, options);
    expect(wrapper).toBeEmptyRender();
    expect(dialogWrapper).toBeEmptyRender();
    analyticsUtil.checkIfAnalyticsShouldBeDisplayed({
      settings: newSettings, showAnalytics: false,
    });
    wrapper.update();
    expect(wrapper).toIncludeText('Opt-in to sharing anonymous data in order to improve Lisk Hub.');
    wrapper.find('a.url-link').simulate('click');
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('Anonymous Data Collection');
  });
});
