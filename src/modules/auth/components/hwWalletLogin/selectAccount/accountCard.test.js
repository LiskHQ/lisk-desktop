import React from 'react';
import { mount } from 'enzyme';
import AccountCard from './accountCard';

describe.skip('Account Card', () => {
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
      index: 1,
      onSaveNameAccounts: jest.fn(),
      onSelectAccount: jest.fn(),
      t: (v) => v,
    };
  });

  it('Should render accountCard properly', () => {
    wrapper = mount(<AccountCard {...props} />);
    expect(wrapper).toContainMatchingElement('.hw-account');
  });

  it('Should call props.onSaveNameAccounts function', () => {
    wrapper = mount(<AccountCard {...props} />);
    wrapper.simulate('mouseover');
    expect(wrapper).toContainMatchingElement('.edit-account');
    expect(wrapper).not.toContainMatchingElement('.save-account');

    wrapper.find('.edit-account').at(0).simulate('click');
    expect(wrapper).not.toContainMatchingElement('.edit-account');
    expect(wrapper).toContainMatchingElement('.save-account');

    wrapper.find('.account-name input').simulate('change', { target: { value: 'Lisk Account' } });
    wrapper.find('.save-account').at(0).simulate('click');
    expect(props.onSaveNameAccounts).toBeCalledWith('Lisk Account', props.account.summary.address);
  });

  it('Should call onSelectAccount function for login', () => {
    wrapper = mount(<AccountCard {...props} />);
    expect(wrapper).toContainMatchingElement('.select-account');
    wrapper.find('.select-account').at(0).simulate('click');
    expect(props.onSelectAccount).toBeCalledWith(props.account, props.index);
  });
});
