import React from 'react';
import { mount } from 'enzyme';
import AccountInfo from './accountInfo';
import accounts from '../../../../test/constants/accounts';

describe('TxDetail AccountInfo', () => {
  const props = {
    label: 'Label test',
    address: accounts.genesis.address,
    token: 'LSK',
    netCode: 1,
  };

  it('Should render with address and label passed as props', () => {
    const wrapper = mount(<AccountInfo {...props} />);
    expect(wrapper.find('.label').text()).toEqual(props.label);
    expect(wrapper.find('.address').first().text()).toEqual(props.address);
  });

  it('Should render with invalid address and label passed as props', () => {
    const newProps = { ...props, address: 'sdfsdf67565' };
    const wrapper = mount(<AccountInfo {...newProps} />);
    expect(wrapper.find('.label').text()).toEqual('Label test');
    expect(wrapper.find('.address').first().text()).toEqual('sdfsdf67565');
  });

  it('Should render the name if passed', () => {
    const namedProps = { ...props, address: 'sdfsdf67565', name: 'genesis' };
    const wrapper = mount(<AccountInfo {...namedProps} />);
    expect(wrapper.text().indexOf('genesis')).not.toEqual(-1);
  });
});
