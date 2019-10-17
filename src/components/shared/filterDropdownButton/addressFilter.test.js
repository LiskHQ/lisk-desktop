import React from 'react';
import { mount } from 'enzyme';
import AddressFilter from './addressFilter';

describe('AddressFilter', () => {
  let wrapper;
  const props = {
    t: v => v,
    filters: {
      recipient: '',
    },
    name: 'recipient',
    updateCustomFilters: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<AddressFilter {...props} />);
  });

  it('Should handle input', () => {
    wrapper.find('.input').at(1).simulate('change', { target: { name: 'recipient', value: '123L' } });
    jest.advanceTimersByTime(300);
    expect(props.updateCustomFilters).toBeCalled();
  });

  it('Should show error if an invalid address is entered', () => {
    wrapper.find('.input').at(1).simulate('change', { target: { name: 'recipient', value: '123' } });
    jest.advanceTimersByTime(300);
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.feedback.show');
  });
});
