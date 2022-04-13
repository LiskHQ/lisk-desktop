import React from 'react';
import { mount } from 'enzyme';
import { truncateAddress } from '@wallet/utilities/account';
import accounts from '@tests/constants/wallets';
import AccountMigration from './index';

describe('AccountMigration component', () => {
  const props = {
    account: accounts.empty_account,
    showBalance: true,
  };

  it('should render properly', () => {
    const wrapper = mount(<AccountMigration {...props} />);
    const html = wrapper.html();
    expect(html).toContain(accounts.empty_account.legacy.address);
    expect(html).toContain(truncateAddress(accounts.empty_account.summary.address, 'medium'));
    expect(html).toContain('98,970,000 LSK');
  });

  it('should not render balance', () => {
    const wrapper = mount(<AccountMigration {...props} showBalance={false} />);
    const html = wrapper.html();
    expect(html).toContain(accounts.empty_account.legacy.address, 'medium');
    expect(html).toContain(truncateAddress(accounts.empty_account.summary.address, 'medium'));
  });
});
