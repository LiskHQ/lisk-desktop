import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import SecondPassphrase from './secondPassphrase';

describe('SecondPassphrase', () => {
  let wrapper;

  const normalAccount = {
    isDelegate: false,
    address: '16313739661670634666L',
    balance: 1000e8,
  };

  const withSecondPassAccount = {
    isDelegate: true,
    address: '16313739661670634666L',
    balance: 1000e8,
    secondSignature: 'sample phrase',
  };

  const props = {
    peers: {},
    setActiveDialog: () => {},
    registerSecondPassphrase: () => {},
  };

  describe('Account with second passphrase', () => {
    it('renders a list element for an account which already has a second passphrase', () => {
      wrapper = mount(<SecondPassphrase {...Object.assign({}, props,
        { account: withSecondPassAccount })} />);
      expect(wrapper.find('.empty-template')).to.have.length(1);
    });
  });

  describe('Account without second passphrase', () => {
    it('renders one MenuItem component for a normal account', () => {
      wrapper = mount(<SecondPassphrase {...Object.assign({}, props,
        { account: normalAccount })} />);
      expect(wrapper.find('MenuItem')).to.have.length(1);
    });

    it('calls setActiveDialog when clicked', () => {
      const spiedProps = Object.assign({}, props, {
        account: normalAccount,
        setActiveDialog: sinon.spy(),
      });
      wrapper = mount(<SecondPassphrase {...spiedProps}/>);
      wrapper.find('MenuItem').simulate('click');
      expect(spiedProps.setActiveDialog).to.have.been.calledWith();
    });
  });
});
