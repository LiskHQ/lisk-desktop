import React from 'react';
import { mount } from 'enzyme';
import Accounts from './accounts';

describe('Accounts', () => {
  let wrapper;

  const props = {
    t: v => v,
    accounts: [],
    onSelectedRow: jest.fn(),
    rowItemIndex: 0,
    updateRowItemIndex: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Accounts {...props} />);
  });

  it('should render properly empty accounts', () => {
    expect(wrapper).toContainMatchingElement('.accounts');
    expect(wrapper).toContainMatchingElement('.accounts-header');
    expect(wrapper).toContainMatchingElement('.accounts-subtitle');
    expect(wrapper).toContainMatchingElement('.account-content');
    expect(wrapper).not.toContainMatchingElement('.account-row');
  });

  it('should render properly with accounts data', () => {
    const newProps = { ...props };
    newProps.accounts = [
      {
        address: '123456L',
        title: 'John',
        balance: '120',
      },
    ];
    wrapper = mount(<Accounts {...newProps} />);

    expect(wrapper).toContainMatchingElement('.accounts');
    expect(wrapper).toContainMatchingElement('.accounts-header');
    expect(wrapper).toContainMatchingElement('.accounts-subtitle');
    expect(wrapper).toContainMatchingElement('.account-content');
    expect(wrapper).toContainMatchingElement('.account-row');
  });

  it('should call onClick function on selected row', () => {
    const newProps = { ...props };
    newProps.accounts = [
      {
        address: '123456L',
        balance: '120',
      },
    ];
    wrapper = mount(<Accounts {...newProps} />);

    wrapper.find('.account-row').at(0).simulate('click');
    expect(props.onSelectedRow).toBeCalled();
  });
});
