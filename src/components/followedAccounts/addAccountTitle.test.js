import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import AddAccountTitle from './addAccountTitle';
import accounts from '../../../test/constants/accounts';

describe('Add Account Title Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      account: accounts.genesis,
      address: accounts.genesis.address,
      accounts: { LSK: [] },
      prevStep: spy(),
      t: key => key,
      addAccount: spy(),
    };

    wrapper = mount(<AddAccountTitle {...props} />);
  });

  it('renders one Input components', () => {
    expect(wrapper.find('Input')).to.have.length(1);
  });

  it('renders two Button component', () => {
    expect(wrapper.find('Button')).to.have.length(2);
  });

  it('renders Input with delegate name if account is delegate', () => {
    props = {
      account: { delegate: accounts.delegate },
      address: accounts.delegate.address,
    };
    wrapper.setProps(props);
    wrapper.update();
    expect(wrapper.find('Input.account-title')).to.have.prop('disabled');
  });

  it('accepts empty field', () => {
    wrapper.find('.account-title input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.account-title').text()).to.not.contain('Required');
  });

  it('recognises too long title', () => {
    wrapper.find('.account-title input').simulate('change', { target: { value: 'this is a very long title' } });
    expect(wrapper.find('Input.account-title').text()).to.contain('Title too long');
  });

  it('cancels the process on button click', () => {
    wrapper.find('.cancel').first().simulate('click');
    expect(props.prevStep).to.have.been.calledWith({ reset: true });
  });

  it('goes to next step on button click', () => {
    wrapper.find('.account-title input').simulate('change', { target: { value: 'some title' } });
    wrapper.find('.next').first().simulate('click');

    expect(props.addAccount).to.have.been.calledWith({
      account: {
        address: accounts.genesis.address,
        title: 'some title',
        isDelegate: false,
        publicKey: accounts.genesis.publicKey,
      },
    });
  });
});
