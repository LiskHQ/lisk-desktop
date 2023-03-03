import React from 'react';
import { mount } from 'enzyme';
import { truncateAddress } from '@wallet/utils/account';
import wallets from '@tests/constants/wallets';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import MigrationDetails from './index';

jest.mock('@token/fungible/hooks/queries');

describe('MigrationDetails component', () => {
  const props = {
    wallet: {
      ...wallets.empty_wallet,
      token: [{ name: 'Lisk', symbol: 'LSK', availableBalance: 0, ...mockAppsTokens.data[0] }],
    },
    showBalance: true,
  };

  useTokensBalance.mockReturnValue({ data: mockAppsTokens });

  it('should render properly', () => {
    const wrapper = mount(<MigrationDetails {...props} />);
    const html = wrapper.html();
    expect(html).toContain(wallets.empty_wallet.legacy.address);
    expect(html).toContain(truncateAddress(wallets.empty_wallet.summary.address, 'medium'));
    expect(html).toContain('98,970,000 LSK');
  });

  it('should not render balance', () => {
    const wrapper = mount(<MigrationDetails {...props} showBalance={false} />);
    const html = wrapper.html();
    expect(html).toContain(wallets.empty_wallet.legacy.address, 'medium');
    expect(html).toContain(truncateAddress(wallets.empty_wallet.summary.address, 'medium'));
  });
});
