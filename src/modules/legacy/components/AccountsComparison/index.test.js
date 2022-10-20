import { useSelector } from 'react-redux';
import { truncateAddress } from '@wallet/utils/account';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import wallets from '@tests/constants/wallets';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { tokensBalance as mockTokens } from '@token/fungible/__fixtures__';
import Reclaim from './index';
import styles from './reclaim.css';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
jest.mock('@account/hooks/useCurrentAccount', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0]]),
}));

const mockNonMigrated = wallets.non_migrated;

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux');

  return {
    __esModule: true,
    ...originalModule,
    useSelector: jest.fn(() => ({
      ...mockNonMigrated,
      token: mockTokens,
    })),
  };
});

window.open = jest.fn();

describe('Reclaim balance screen', () => {
  let props;

  beforeEach(() => {
    props = {
      t: (v) => v,
      history: {
        push: jest.fn(),
      },
    };
  });

  it('should render legacy and new addresses', () => {
    const wrapper = mountWithRouterAndQueryClient(Reclaim, props, {});
    const html = wrapper.html();
    expect(html).toContain(wallets.non_migrated.legacy.address);
    expect(html).toContain(truncateAddress(wallets.non_migrated.summary.address, 'medium'));
  });

  it('Opens send modal', () => {
    const wrapper = mountWithRouterAndQueryClient(Reclaim, props, {});
    wrapper.find(styles.button).first().simulate('click');
    expect(addSearchParamsToUrl).toHaveBeenNthCalledWith(1, expect.objectContaining({}), {
      modal: 'reclaimBalance',
    });
  });

  it('Calls windows.open', () => {
    useSelector.mockImplementation(
      jest.fn(() => ({
        ...mockNonMigrated,
        token: [{ name: 'Lisk', symbol: 'LSK', availableBalance: '0' }],
      }))
    );

    const wrapper = mountWithRouterAndQueryClient(Reclaim, props, {});
    wrapper.find('.link').at(0).simulate('click');
    wrapper.find('.link').at(1).simulate('click');
    expect(window.open).toHaveBeenNthCalledWith(
      1,
      'https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration#MigrateanunitiliazedAccount',
      '_blank',
      'rel=noopener noreferrer'
    );
    expect(window.open).toHaveBeenNthCalledWith(
      2,
      'https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration#MigrateanunitiliazedAccount',
      '_blank',
      'rel=noopener noreferrer'
    );
  });

  it('should have the first step checked if balance is above dust threshold', () => {
    useSelector.mockImplementation(
      jest.fn(() => ({
        ...mockNonMigrated,
        token: [{ name: 'Lisk', symbol: 'LSK', availableBalance: '100000000' }],
      }))
    );

    const wrapper = mountWithRouterAndQueryClient(Reclaim, props, {});
    expect(wrapper.find('li.step').at(0)).toHaveClassName('.check')
    expect(wrapper.find('li.step').at(1)).toHaveClassName('.green')
  })
});
