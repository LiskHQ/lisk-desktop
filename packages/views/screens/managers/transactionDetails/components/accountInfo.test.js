import React from 'react';
import { mount } from 'enzyme';
import wallets from '@tests/constants/wallets';
import WalletInfo from './walletInfo';

describe('TxDetail WalletInfo', () => {
  const props = {
    label: 'Label test',
    address: wallets.genesis.summary.address,
    token: 'LSK',
    network: {
      name: 'Mainnet',
    },
  };

  it('Should render with address and label passed as props', () => {
    const wrapper = mount(<WalletInfo {...props} />);
    expect(wrapper.find('.label').text()).toEqual(props.label);
    expect(wrapper.find('.address').first().text()).toEqual(props.address);
  });

  it('Should render with invalid address and label passed as props', () => {
    const newProps = { ...props, address: 'invalid_address' };
    const wrapper = mount(<WalletInfo {...newProps} />);
    expect(wrapper.find('.label').text()).toEqual('Label test');
    expect(wrapper.find('.address').first().text()).toEqual('invalid_address');
  });

  it('Should render the name if passed', () => {
    const namedProps = { ...props, address: 'invalid_address', name: 'genesis' };
    const wrapper = mount(<WalletInfo {...namedProps} />);
    expect(wrapper.text().indexOf('genesis')).not.toEqual(-1);
  });
});
