import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import ConfirmMessage from './confirmMessage';
import accounts from '../../../../test/constants/accounts';

describe('Confirm Message Component', () => {
  const props = {
    account: accounts.genesis,
    message: 'Random message',
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Router><ConfirmMessage {...props} /></Router>);
  });

  it('Should render correct result', () => {
    expect(wrapper).toContainExactlyOneMatchingElement('textarea');
    expect(wrapper.find('textarea')).toIncludeText(props.message);
  });

  it('Should handle copying result', () => {
    expect(wrapper).toContainMatchingElements(2, 'button');
    wrapper.find('button').at(0).simulate('click');
    expect(wrapper.find('button').at(0)).toBeDisabled();
    jest.advanceTimersByTime(3000);
    wrapper.update();
    expect(wrapper.find('button').at(0)).not.toBeDisabled();
    wrapper.unmount();
  });
});
