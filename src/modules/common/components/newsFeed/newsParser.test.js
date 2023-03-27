import React from 'react';
import { mount } from 'enzyme';
import NewsParser from './newsParser';

describe('NewsParser', () => {
  it("should render no hashtags and mentioned user twitter links when they don't exist in a twit", () => {
    const value = 'test twit';
    const wrapper = mount(<NewsParser>{value}</NewsParser>);
    expect(wrapper.find('.hashtag')).toHaveLength(0);
    expect(wrapper.find('.user')).toHaveLength(0);
  });
  it('should replace hashtags and mentioned user with a equivalent twitter links', () => {
    const value = 'A #lisk twit which is written by @yashar at #lightcurve';
    const wrapper = mount(<NewsParser>{value}</NewsParser>);
    expect(wrapper.find('.hashtag')).toHaveLength(2);
    expect(wrapper.find('.user')).toHaveLength(1);
  });
});
