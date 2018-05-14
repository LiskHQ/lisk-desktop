import React from 'react';
import { expect } from 'chai';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import DelegateStatistics from './delegateStatistics';

describe('DelegateStatistics', () => {
  const storeState = {
    account: {
      votes: new Array(40).fill({
        username: null,
        address: '3484156157234038617L',
        publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
        balance: '0',
      }),
      voters: new Array(40).fill({
        username: null,
        address: '3484156157234038617L',
        publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
        balance: '0',
      }),
    },
  };

  it('should render DelegateStatistics', () => {
    const wrapper = mountWithContext(<DelegateStatistics />, {});
    expect(wrapper.find('DelegateStatistics').length).to.have.equal(1);
  });

  it('should not display showAll button, if all votes are already shown', () => {
    const wrapper = mountWithContext(<DelegateStatistics />, { storeState });

    expect(wrapper.find('.showMore').length).to.have.equal(2);
    wrapper.find('.showMore').at(0).simulate('click');
    expect(wrapper.find('.showMore').length).to.have.equal(1);
  });

  it('should not display showMore button, if all voters are already shown', () => {
    const wrapper = mountWithContext(<DelegateStatistics />, { storeState });

    expect(wrapper.find('.showMore').length).to.have.equal(2);
    wrapper.find('.showMore').at(1).simulate('click');
    expect(wrapper.find('.showMore').length).to.have.equal(1);
  });
});
