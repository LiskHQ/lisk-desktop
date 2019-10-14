import React from 'react';
import { mount } from 'enzyme';
import NewsFeed from './newsFeed';

describe('NewsFeed', () => {
  const t = key => key;
  const timestampNow = 1483228800000;
  const newsFeed = {
    data: [{
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
    }],
  };

  const props = {
    channels: { test: true },
    t,
    newsFeed,
  };

  it('should render empty state', () => {
    const newProps = {
      ...props,
      newsFeed: {
        error: 'Some error',
        data: [],
      },
    };

    const wrapper = mount(<NewsFeed {...newProps} />);

    expect(wrapper.find('.empty-news').exists()).toEqual(true);
  });

  it('should render News', () => {
    const wrapper = mount(<NewsFeed {...props} />);

    expect(wrapper).toContainMatchingElements(2, '.news-item');
  });
});
