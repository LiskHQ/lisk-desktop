import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import NewsFeed from './newsFeed';
import SettingsNewsFeed from './settingsNewsFeed';
import liskServiceApi from '../../utils/api/liskService';

describe('NewsFeed', () => {
  let liskServiceApiMock;

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };
  let clock;

  const t = key => key;

  const props = {
    channels: { test: true },
    t,
    getNewsFeed: () => {},
    newsFeed: [
      {
        source: 'test',
        content: '',
        timestamp: '',
        url: '',
      },
      {
        source: 'test',
        content: '',
        timestamp: '',
        url: '',
      },
      {
        source: 'test',
        content: '',
        timestamp: '',
        url: '',
      },
      {
        source: 'test',
        content: '',
        timestamp: '',
        url: '',
      },
      {
        source: 'test',
        content: '',
        timestamp: '',
        url: '',
      },
    ],
  };
  const timestampNow = 1483228800000;
  const newsFeed = [
    {
      source: 'test',
      content: 'test',
      timestamp: new Date(timestampNow),
      url: 'test',
    },
    {
      source: 'test',
      content: 'test',
      timestamp: new Date(),
      url: 'test',
    },
    {
      source: 'test3',
      content: 'test',
      timestamp: new Date(),
      url: 'test',
    },
    {
      source: 'test4',
      content: 'test',
      timestamp: new Date(),
      url: 'test',
    },
    {
      source: 'test5',
      content: 'test',
      timestamp: new Date(),
      url: 'test',
    },
  ];

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      now: timestampNow,
      toFake: ['Date'],
    });

    liskServiceApiMock = sinon.stub(liskServiceApi, 'getNewsFeed').returnsPromise();
  });

  afterEach(() => {
    liskServiceApiMock.restore();
    clock.restore();
  });

  it('should render SettingsNewsFeed', () => {
    const wrapper = mount(<MemoryRouter>
      <NewsFeed {...props} />
    </MemoryRouter>, options);
    wrapper.find('.settingsButton').simulate('click');
    expect(wrapper.find(SettingsNewsFeed).exists()).to.equal(true);
  });

  it('should render No feeds chosen', () => {
    const newProps = {
      channels: { test: true },
      t,
      getNewsFeed: () => {},
      newsFeed: [],
      showNewsFeedEmptyState: true,
    };

    const wrapper = mount(<MemoryRouter>
      <NewsFeed {...newProps} />
    </MemoryRouter>, options);
    wrapper.find('.settingsButton').simulate('click');
    expect(wrapper.find(SettingsNewsFeed).exists()).to.equal(true);
  });

  it('should render not SettingsNewsFeed', () => {
    const wrapper = mount(<MemoryRouter>
      <NewsFeed {...props} />
    </MemoryRouter>, options);
    wrapper.find('.settingsButton').simulate('click');
    expect(wrapper.find(SettingsNewsFeed).exists()).to.equal(true);
    wrapper.find('.settingsButton').simulate('click');
    expect(wrapper.find(SettingsNewsFeed).exists()).to.equal(false);
  });

  it('should render News', () => {
    const wrapper = mount(<MemoryRouter>
      <NewsFeed {...props} />
    </MemoryRouter>, options);
    liskServiceApiMock.resolves(newsFeed);
    wrapper.update();

    expect(wrapper).to.have.descendants('.news-item');
  });

  it('should render showMore button properly', () => {
    const wrapper = mount(<MemoryRouter>
      <NewsFeed {...props} />
    </MemoryRouter>, options);
    expect(wrapper.find('.show-more').exists()).to.equal(true);
    expect(wrapper.find('.showMore').exists()).to.equal(false);
    wrapper.find('.show-more').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('.showMore').exists()).to.equal(true);
    wrapper.find('.show-more').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('.showMore').exists()).to.equal(false);
  });
});
