import React from 'react';
import { mount } from 'enzyme';
import accounts from '@tests/constants/accounts';
import AccountInfo from '@wallet/detail/info/accountInfo';

describe('TxDetail AccountInfo', () => {
  const props = {
    label: 'Label test',
    address: accounts.genesis.summary.address,
    token: 'LSK',
    network: {
      name: 'Mainnet',
    },
  };

  it('Should render with address and label passed as props', () => {
    const wrapper = mount(<AccountInfo {...props} />);
    expect(wrapper.find('.label').text()).toEqual(props.label);
    expect(wrapper.find('.address').first().text()).toEqual(props.address);
  });

  it('Should render with invalid address and label passed as props', () => {
    const newProps = { ...props, address: 'invalid_address' };
    const wrapper = mount(<AccountInfo {...newProps} />);
    expect(wrapper.find('.label').text()).toEqual('Label test');
    expect(wrapper.find('.address').first().text()).toEqual('invalid_address');
  });

  it('Should render the name if passed', () => {
    const namedProps = { ...props, address: 'invalid_address', name: 'genesis' };
    const wrapper = mount(<AccountInfo {...namedProps} />);
    expect(wrapper.text().indexOf('genesis')).not.toEqual(-1);
  });
});
