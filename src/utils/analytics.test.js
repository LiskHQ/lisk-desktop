import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { advanceBy, clear } from 'jest-date-mock';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DialogHolder from '../components/toolbox/dialog/holder';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import analyticsUtil from './analytics';
import i18n from '../i18n';

describe('Analytics Util', () => {
  let props;
  let store;
  let options;

  beforeEach(() => {
    props = {
      settings: { statistics: false },
      t: k => k,
      settingsUpdated: jest.fn((data) => {
        props.settings = {
          ...props.settings,
          ...data,
        };
      }),
      toastDisplayed: jest.fn(),
    };

    store = configureMockStore()({
      settings: { statistics: false },
      settingsUpdated: props.settingsUpdated,
      toastDisplayed: jest.fn(),
    });

    options = {
      context: { i18n, store },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
      },
    };

    store.dispatch = jest.fn();
  });

  afterEach(() => {
    store.dispatch.mockRestore();
    clear();
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

  it('Should call FlashMessageHolder.addMessage 7 days after it was closed', () => {
    const wrapper = mount(<FlashMessageHolder />, options);
    const dialogWrapper = mount(<DialogHolder {...props} />, options);
    expect(wrapper).toBeEmptyRender();
    expect(dialogWrapper).toBeEmptyRender();
    analyticsUtil.onTriggerPageLoaded({
      settings: props.settings, settingsUpdated: props.settingsUpdated,
    });
    expect(props.settingsUpdated).toHaveBeenCalledWith({ statisticsRequest: true });
    wrapper.update();
    wrapper.find('a.url-link').simulate('click');
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('Anonymous Data Collection');
    dialogWrapper.find('button.cancel-button').simulate('click');
    props.settings.statisticsFollowingDay = moment().format('YYYY-MM-DD');
    wrapper.unmount();
    wrapper.mount();

    expect(wrapper).toBeEmptyRender();
    analyticsUtil.checkIfAnalyticsShouldBeDisplayed({ settings: props.settings });
    expect(wrapper).toBeEmptyRender();

    advanceBy(8 * 24 * 60 * 60 * 1000);
    analyticsUtil.checkIfAnalyticsShouldBeDisplayed({ settings: props.settings });
    expect(wrapper).toIncludeText('Opt-in to sharing anonymous data in order to improve Lisk Hub.');
  });
});
