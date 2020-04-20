import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import WalletDetails from './walletDetails';

describe('WalletDetails ', () => {
  let wrapper;
  const props = {
    balance: '69550000000',
    t: spy(),
    address: '5201600508578320196L',
    activeToken: 'LSK',
    account: {
      loginType: 0,
    },
  };

  it('should render a QR code in light mode', () => {
    wrapper = mount(<WalletDetails {...props} darkMode={false} />);
    expect(wrapper.find('QRCode')).to.have.lengthOf(1);
  });

  it('should render a QR code in dark mode', () => {
    wrapper = mount(<WalletDetails {...props} darkMode />);
    expect(wrapper.find('QRCode')).to.have.lengthOf(1);
  });
  it('should render a button to verify account on HW', () => {
    wrapper = mount(<WalletDetails {...props} account={{ loginType: 1 }} />);
    expect(wrapper.find('.verify-address')).to.have.lengthOf(1);
  });
});
