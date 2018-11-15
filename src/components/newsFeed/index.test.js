import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import i18n from '../../i18n';
import NewsFeed from './index';
import * as settingsActions from '../../actions/settings';

describe.skip('NewsFeedHOC', () => {
  let wrapper;
  const store = configureMockStore([thunk])({
    settings: {
      channels: {},
    },
    liskService: {
      newsFeed: [],
      showNewsFeedEmptyState: false,
    },
    getNewsFeed: sinon.spy(),
    settingsUpdated: sinon.spy(),
  });

  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
      <Router>
        <I18nextProvider i18n={ i18n }>
          <NewsFeed />
        </I18nextProvider>
      </Router>
    </Provider>);
  });

  it('should render NewsFeed', () => {
    expect(wrapper).to.have.descendants('NewsFeed');
  });

  it('should bind settingsUpdated action to Form props.settingsUpdated', () => {
    const actionsSpy = sinon.spy(settingsActions, 'settingsUpdated');
    wrapper.find('NewsFeed').props().settingsUpdated({ });
    expect(actionsSpy).to.be.calledWith({ });
    actionsSpy.restore();
  });
});
