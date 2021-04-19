import React from 'react';
import { mount } from 'enzyme';
import AcountMigration from '.';
import accounts from '../../../../test/constants/accounts';
import { truncateAddress } from '../../../utils/account';

describe('AccountMigration component', () => {
  const props = {
    account: accounts.empty_account,
    showBalance: true,
  };

  it('should render properly', () => {
    const wrapper = mount(<AcountMigration {...props} />);
    const html = wrapper.html();
    expect(html).toContain(truncateAddress(accounts.empty_account.legacy.address));
    expect(html).toContain(truncateAddress(accounts.empty_account.summary.address));
  });
});
