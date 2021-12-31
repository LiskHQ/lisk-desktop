import React from 'react';
import { mount } from 'enzyme';
import StickyHeader from '.';

describe('StickyHeader', () => {
  let wrapper;
  const props = {
    title: 'header title',
    filters: <div className="filters" />,
    scrollToSelector: '.test-class',
  };

  it('should render correctly', () => {
    wrapper = mount(<StickyHeader {...props} />);
    expect(wrapper.find('h1')).toHaveText('header title');
    expect(wrapper.find('.filters')).toExist();
  });
});
