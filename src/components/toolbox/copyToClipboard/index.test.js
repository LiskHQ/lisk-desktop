import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import i18n from '../../../i18n';
import CopyToClipboard from './index';

describe('CopyToClipboard', () => {
  let wrapper;
  const props = {
    text: 'test',
    className: 'className',
    value: 2,
    t: key => key,
    i18n,
  };
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };
  const copiedText = 'Copied!';

  beforeEach(() => {
    wrapper = mount(<CopyToClipboard {...props} />, options);
  });

  it('should show "Copied!" on click', () => {
    wrapper.find('.default').simulate('click');
    expect(wrapper.find('.copied').text()).toEqual(copiedText);
  });

  it('should hide "Copied!" after 3000ms', () => {
    wrapper.find('.default').simulate('click');
    jest.advanceTimersByTime(2900);
    expect(wrapper.find('.copied').text()).toEqual(copiedText);
    jest.advanceTimersByTime(2000);
    wrapper.update();
    expect(wrapper.find('.copied')).toHaveLength(0);
    expect(wrapper.find('.default').text()).toEqual(`${props.text} `);
  });
});
