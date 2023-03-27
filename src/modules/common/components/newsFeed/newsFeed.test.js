import React from 'react';
import { mount } from 'enzyme';
import NewsFeed from './newsFeed';

describe('NewsFeed', () => {
  const t = (key) => key;
  const timestampNow = 1483228800000;
  const newsFeed = {
    data: [
      {
        source: 'test1',
        sourceId: 'test1',
        content: 'test',
        createdAt: new Date(timestampNow),
        url: 'test',
        author: 'liskHQ',
        title: '',
      },
      {
        source: 'test2',
        sourceId: 'test2',
        content: 'test',
        createdAt: new Date(),
        url: 'test',
        author: 'liskHQ',
        title: '',
      },
      {
        source: 'test3',
        sourceId: 'test3',
        content: 'test',
        createdAt: new Date(),
        url: 'test',
        author: 'liskHQ',
        title: '',
      },
      {
        source: 'test4',
        sourceId: 'test4',
        content: 'test',
        createdAt: new Date(),
        url: 'test',
        author: 'liskHQ',
        title: '',
      },
      {
        source: 'test5',
        sourceId: 'test5',
        content: 'test',
        createdAt: new Date(),
        url: 'test',
        author: 'liskHQ',
        title: '',
      },
    ],
    error: '',
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

    expect(wrapper.find('.news-item')).toHaveLength(5);
  });
});
