import React from 'react';
import { mount } from 'enzyme';
import BalanceTable from './balanceTable';

describe('unlock transaction Status', () => {
  let wrapper;

  const props = {
    t: key => key,
    lockedBalance: undefined,
    availableBalance: undefined,
    currentBlock: undefined,
    account: undefined,
  };

  beforeEach(() => {
    wrapper = mount(
      <BalanceTable {...props} />,
    );
  });

  it('renders properly', () => {
    expect(wrapper).toContainMatchingElement('.lock-balance-amount-container');
  });
});
