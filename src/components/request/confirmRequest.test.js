import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import ConfirmRequest from './confirmRequest';

describe('Confirm Request', () => {
  let wrapper;
  let props;
  const setup = params => shallow(<ConfirmRequest {...params} />);

  beforeEach(() => {
    props = {
      t: key => key,
      address: '234l',
      amount: '2345',
      reference: 'test',
      prevStep: spy(),
      finalCallback: spy(),
    };

    wrapper = setup(props);
  });

  it('lets you go to prior step', () => {
    wrapper.find('.back-button').simulate('click');
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('lets you finish request', () => {
    wrapper.find('.finish-button').simulate('click');
    expect(props.finalCallback).to.have.been.calledWith();
  });

  it('magnifies QR code on click', () => {
    expect(wrapper.find('.qr-code').prop('className')).to.contain('minimized');
    wrapper.find('.qr-code').simulate('click');
    expect(wrapper.find('.qr-code').prop('className')).to.contain('magnified');
  });

  it('render confirmRequest component with reference props empty and link not have reference', () => {
    props.reference = '';
    const link = `lisk://wallet?recipient=${props.address}&amount=${props.amount}`;
    wrapper = setup(props);
    expect(wrapper.find('.copy').props().value).to.be.equal(link);
  });
});
