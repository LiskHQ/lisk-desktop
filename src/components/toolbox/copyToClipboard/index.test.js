import React from 'react';
import { mount } from 'enzyme';
import CopyToClipboard from './index';

describe('CopyToClipboard', () => {
  let wrapper;
  const props = {
    text: 'test',
    className: 'className',
    value: 2,
    onClick: jest.fn(),
  };
  const copiedText = 'Copied';

  beforeEach(() => {
    wrapper = mount(<CopyToClipboard {...props} />);
  });

  it('should show "Copied!" on click', () => {
    wrapper.find('.default').simulate('click');
    expect(wrapper.find('.copied').text().trim()).toEqual(copiedText);
  });

  it('should hide "Copied!" after 3000ms', () => {
    wrapper.find('.default').simulate('click');
    jest.advanceTimersByTime(2900);
    expect(wrapper.find('.copied').text().trim()).toEqual(copiedText);
    jest.advanceTimersByTime(2000);
    wrapper.update();
    expect(wrapper.find('.copied')).toHaveLength(0);
    expect(wrapper.find('.default').text()).toEqual(`${props.text} `);
  });
});
