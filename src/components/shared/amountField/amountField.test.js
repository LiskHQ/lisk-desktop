import React from 'react';
import { mount } from 'enzyme';
import { MaxAmountWarning } from './index';

const props = {
  resetInput: jest.fn(),
  message: 'You are about to send your entire balance',
  ignoreClicks: jest.fn(),
};
const wrapper = mount(<MaxAmountWarning {...props} />);

describe('MaxAmountWarning', () => {
  it('does not rerender the amount validation when the max amount warning is clicked', () => {
    wrapper.find('.entire-balance-warning').simulate('click');
    expect(props.ignoreClicks).toHaveBeenCalledTimes(1);
  });

  it('closes the max amount warning when the close button is clicked', () => {
    wrapper.find('.close-entire-balance-warning').simulate('click');
    expect(props.resetInput).toHaveBeenCalledTimes(1);
    expect(wrapper).not.toContain('You are about to send your entire balance');
  });
});
