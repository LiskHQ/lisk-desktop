import React from 'react';
import { shallow } from 'enzyme';
import AccountInfo from './accountInfo';
import accounts from '../../../../test/constants/accounts';

describe('TxDetail AccountInfo', () => {
  it('Should render with address and label passed as props', () => {
    const props = {
      label: 'Label test',
      address: accounts.genesis.address,
    };
    const wrapper = shallow(<AccountInfo {...props} />);
    expect(wrapper.find('.label').text()).toEqual(props.label);
    expect(wrapper.find('.address').text()).toEqual(props.address);
  });
});
