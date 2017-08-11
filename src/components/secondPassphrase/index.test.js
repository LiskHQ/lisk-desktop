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

  const props = {
    peers: {},
    setActiveDialog: () => {},
    showSuccessAlert: () => {},
  };

  it('renders one MenuItem component for a normal account', () => {
    wrapper = mount(<SecondPassphrase {...Object.assign({}, props,
      { account: normalAccount })} />);
    expect(wrapper.find('MenuItem')).to.have.length(1);
  });

  it('renders a list element for an account which already has a second passphrase', () => {
    wrapper = mount(<SecondPassphrase {...Object.assign({}, props,
      { account: withSecondPassAccount })} />);
    expect(wrapper.find('.empty-template')).to.have.length(1);
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
