import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import AccountInfo from './accountInfo';
import accounts from '../../../../test/constants/accounts';

describe('TxDetail AccountInfo', () => {
  it('Should render with address and label passed as props', () => {
    const props = {
      label: 'Label test',
      address: accounts.genesis.address,
    };
    const wrapper = mount(<Router><AccountInfo {...props} /></Router>);
    expect(wrapper.find('.label').text()).toEqual(props.label);
    expect(wrapper.find('.address').first().text()).toEqual(props.address);
  });
});
