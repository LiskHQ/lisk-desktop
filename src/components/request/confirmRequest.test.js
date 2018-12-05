import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import ConfirmRequest from './confirmRequest';

describe('Confirm Request', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      t: key => key,
      address: '234l',
      amount: '2345',
      reference: 'test',
      prevStep: spy(),
      finalCallback: spy(),
    };

    wrapper = shallow(<ConfirmRequest {...props} />);
  });

  it('lets you go to prior step', () => {
    wrapper.find('.back-button').simulate('click');
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('lets you finish request', () => {
    wrapper.find('.okay-button').simulate('click');
    expect(props.finalCallback).to.have.been.calledWith();
  });

  it('magnifies QR code on click', () => {
    expect(wrapper.find('.qr-code').prop('className')).to.contain('minimized');
    wrapper.find('.qr-code').simulate('click');
    expect(wrapper.find('.qr-code').prop('className')).to.contain('magnified');
  });
});
