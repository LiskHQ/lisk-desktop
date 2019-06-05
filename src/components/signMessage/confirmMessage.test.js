import React from 'react';
import { mount } from 'enzyme';
import ConfirmMessage from './confirmMessage';
import accounts from '../../../test/constants/accounts';

describe('Confirm Message Component', () => {
  const props = {
    account: accounts.genesis,
    message: 'Random message',
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<ConfirmMessage {...props} />);
  });

  it('Should render correct result', () => {
    expect(wrapper).toContainExactlyOneMatchingElement('textarea');
    expect(wrapper.find('textarea')).toIncludeText(props.message);
  });

  it('Should handle copying result', () => {
    expect(wrapper).toContainExactlyOneMatchingElement('button');
    wrapper.find('button').simulate('click');
    expect(wrapper.find('button')).toBeDisabled();
    jest.advanceTimersByTime(3000);
    wrapper.update();
    expect(wrapper.find('button')).not.toBeDisabled();
    wrapper.unmount();
  });
});
