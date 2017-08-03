import React from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { SecondPassphrase } from './index';

chai.use(chaiEnzyme());
chai.use(sinonChai);

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

  it('renders one MenuItem component for a normal account', () => {
    const props = {
      account: normalAccount,
      peers: {},
      setActiveDialog: () => {},
      showSuccessAlert: () => {},
    };
    wrapper = mount(<SecondPassphrase {...props} />);
    expect(wrapper.find('MenuItem')).to.have.length(1);
  });

  it('renders a list element for an account which already has a second passphrase', () => {
    const props = {
      account: withSecondPassAccount,
      peers: {},
      setActiveDialog: () => {},
      showSuccessAlert: () => {},
    };
    wrapper = mount(<SecondPassphrase {...props} />);
    expect(wrapper.find('.empty-template')).to.have.length(1);
  });

  it('calls setActiveDialog when clicked', () => {
    const props = {
      account: normalAccount,
      peers: {},
      setActiveDialog: sinon.spy(),
      showSuccessAlert: () => {},
    };
    wrapper = mount(<SecondPassphrase {...props}/>);
    wrapper.find('MenuItem').simulate('click');
    expect(props.setActiveDialog).to.have.been.calledWith();
  });
});
