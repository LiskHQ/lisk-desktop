import React from 'react';
import { mount } from 'enzyme';
import AccountCard from './accountCard';

describe('Account Card', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      account: {
        summary: {
          address: 'lsk123',
          balance: 100,
          name: 'Lisk',
        },
      },
      accountOnEditMode: '',
      t: v => v,
      onChangeAccountTitle: jest.fn(),
      onEditAccount: jest.fn(),
      onSaveNameAccounts: jest.fn(),
      onSelectAccount: jest.fn(),
    };
  });

  it('Should render accountCard properly', () => {
    wrapper = mount(<AccountCard {...props} />);
    expect(wrapper).toContainMatchingElement('.hw-account');
  });

  it('Should call onEditAccount function', () => {
    wrapper = mount(<AccountCard {...props} />);
    wrapper.simulate('mouseover');
    expect(wrapper).toContainMatchingElement('.edit-account');
    expect(wrapper).not.toContainMatchingElement('.save-account');
    wrapper.find('.edit-account').at(0).simulate('click');
    expect(props.onEditAccount).toBeCalled();
    wrapper.setProps({ accountOnEditMode: props.account.summary.address });
    wrapper.update();
    expect(wrapper).toContainMatchingElement('.save-account');
    wrapper.find('.account-name input').simulate('change', { target: { value: 'Lisk Account' } });
    expect(props.onChangeAccountTitle).toBeCalled();
    wrapper.find('.save-account').at(0).simulate('click');
    expect(props.onSaveNameAccounts).toBeCalled();
  });

  it('Should call onSelectAccount function for login', () => {
    wrapper = mount(<AccountCard {...props} />);
    expect(wrapper).toContainMatchingElement('.select-account');
    wrapper.find('.select-account').at(0).simulate('click');
    expect(props.onSelectAccount).toBeCalled();
  });
});
