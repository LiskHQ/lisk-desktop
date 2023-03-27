import React from 'react';
import { mount } from 'enzyme';
import WalletDetails from './WalletDetails';

describe('WalletDetails', () => {
  let wrapper;

  const props = {
    isLoading: false,
    tokens: [{ availableBalance: '99999800000000', tokenID: '0000000000000000' }],
    t: (key) => key,
  };

  beforeEach(() => {
    wrapper = mount(<WalletDetails {...props} />);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElement('.box');
    expect(wrapper).toContainMatchingElement('.coin-container');
  });

  it('Should show loading state when loading', () => {
    wrapper.setProps({
      isLoading: true,
    });
    expect(wrapper.find('.skeletonLoader')).toBeTruthy();
  });
});
