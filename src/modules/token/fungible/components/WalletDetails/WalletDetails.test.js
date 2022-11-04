import React from 'react';
import { mount } from 'enzyme';
import WalletDetails from './WalletDetails';

describe('WalletDetails', () => {
  let wrapper;

  const props = {
    tokens: [{ availableBalance: '99999800000000', tokenID: "0000000000000000" }],
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<WalletDetails {...props} />);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElement('.coin-container');
    expect(wrapper).toContainMatchingElements(1, 'section.coin-row');
  });
});
