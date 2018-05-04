import React from 'react';
import { expect } from 'chai';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import DelegateStatistics from './delegateStatistics';

describe('DelegateStatistics', () => {
  it('should render DelegateStatistics', () => {
    const wrapper = mountWithContext(<DelegateStatistics />, {});
    expect(wrapper.find('DelegateStatistics').length).to.have.equal(1);
  });

  it('should not display showAll button', () => {
    const storeState = {
      account: {
        votes: new Array(40).fill({
          username: null,
          address: '3484156157234038617L',
          publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
          balance: '0',
        }),
      },
    };
    const wrapper = mountWithContext(<DelegateStatistics />, { storeState });

    expect(wrapper.find('.showAll').length).to.have.equal(1);
    wrapper.find('.showAll').simulate('click');
    expect(wrapper.find('.showAll').length).to.have.equal(0);
  });
});
