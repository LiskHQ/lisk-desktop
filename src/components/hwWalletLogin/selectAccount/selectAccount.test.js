import React from 'react';
import { mount } from 'enzyme';
import SelectAccount from './selectAccount';

describe('Select Account', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      device: {
        deviceId: '123abc',
        model: 'Ledger Nano S',
        deviceModel: 'Ledger Nano S',
      },
      account: {
        address: '123456L',
        balance: 100,
        name: 'Lisk',
      },
      network: 0,
      settings: {
        hardwareAccounts: [],
      },
      t: v => v,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      liskAPIClientSet: jest.fn(),
      settingsUpdated: jest.fn(),
    };
  });

  it('Should render SelectAccount properly', () => {
    wrapper = mount(<SelectAccount {...props} />);
    expect(wrapper).toContainMatchingElement('.create-account');
    expect(wrapper).toContainMatchingElement('.hw-container');
    expect(wrapper).toContainMatchingElement('.go-back');
  });

  // it('Should call onEditAccount function', () => {
  //   wrapper = mount(<AccountCard {...props} />);
  //   wrapper.simulate('mouseover');
  //   expect(wrapper).toContainMatchingElement('.edit-account');
  //   expect(wrapper).not.toContainMatchingElement('.save-account');
  //   wrapper.find('.edit-account').at(0).simulate('click');
  //   expect(props.onEditAccount).toBeCalled();
  //   wrapper.setProps({ accountOnEditMode: 0 });
  //   wrapper.update();
  //   expect(wrapper).toContainMatchingElement('.save-account');
  //   wrapper.find('.account-name').simulate('change', { target: { value: 'Lisk Account' } });
  //   expect(props.onChangeAccountTitle).toBeCalled();
  //   wrapper.find('.save-account').at(0).simulate('click');
  //   expect(props.onSaveNameAccounts).toBeCalled();
  // });

  // it('Should call onSelectAccount function for login', () => {
  //   wrapper = mount(<AccountCard {...props} />);
  //   expect(wrapper).toContainMatchingElement('.select-account');
  //   wrapper.find('.select-account').at(0).simulate('click');
  //   expect(props.onSelectAccount).toBeCalled();
  // });
});
