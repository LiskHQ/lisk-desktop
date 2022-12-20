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

  it('should render correctly if no title is passed', () => {
    const noTitleProps = {
      filters: <div className="filters" />,
      scrollToSelector: '.test-class',
    };
    wrapper = mount(<StickyHeader {...noTitleProps} />);
    expect(wrapper.find('h1')).not.toHaveText('header title');
    expect(wrapper.find('.filters')).toExist();
  });
});
