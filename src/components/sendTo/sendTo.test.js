import React from 'react';
import { expect } from 'chai';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import SendTo from './index';
import routes from './../../constants/routes';

describe('SendTo Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      address: '12345L',
      balance: 0,
      t: key => key,
    };
    wrapper = mountWithContext(<SendTo {...props} />, {});
  });

  it('renders correct link', () => {
    expect(wrapper.find('Link').prop('to')).to.equal(`${routes.main.path}${routes.wallet.path}?recipient=${props.address}`);
  });

  it('updates when address changes', () => {
    wrapper.setProps({ address: '9876L' });
    expect(wrapper.find('Link').prop('to')).to.equal(`${routes.main.path}${routes.wallet.path}?recipient=9876L`);
  });
});
