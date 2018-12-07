import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import Request from './index';

describe('Confirm Request', () => {
  let wrapper;
  let props;
  const setup = params => mount(<Request {...params} />);

  beforeEach(() => {
    props = {
      t: key => key,
      account: {
        address: '234L',
      },
      amount: '2345',
      reference: 'test',
      prevStep: spy(),
      nextStep: spy(),
      finalCallback: spy(),
    };

    wrapper = setup(props);
  });

  it('render Request main component', () => {
    expect(wrapper.find('Request').exists()).to.be.equal(true);
  });

  it('render correct address below QR Code', () => {
    expect(wrapper.find('CopyToClipboard').at(0).props().value).to.be.equal(props.account.address);
  });

  it('render QRCode with correct address', () => {
    props.account.address = '12345L';
    wrapper = setup(props);
    expect(wrapper.find('QRCode').at(0).props().value).to.be.equal(props.account.address);
  });

  it('call nextStep button with correct params', () => {
    wrapper.find('.specify-request').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.props().nextStep).to.be.calledWith({ address: props.account.address });
  });
});
