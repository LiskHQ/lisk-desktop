import { useSelector } from 'react-redux';
import { truncateAddress } from '@wallet/utils/account';
import { useGetInitializationFees } from '@token/fungible/hooks/queries';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import wallets from '@tests/constants/wallets';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useFees } from '@transaction/hooks/queries/useFees';
import Reclaim from './index';
import styles from './reclaim.css';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
  selectSearchParamValue: jest.fn(),
}));
jest.mock('@account/hooks/useCurrentAccount', () => ({
  useCurrentAccount: jest.fn(() => [mockSavedAccounts[0]]),
}));
jest.mock('@token/fungible/hooks/queries/useGetHasUserAccount');
jest.mock('@token/fungible/hooks/queries/useGetInitializationFees');
jest.mock('@transaction/hooks/queries/useFees');

const mockNonMigrated = wallets.non_migrated;
const tokenID = '0000000100000000';

useFees.mockReturnValue({ data: { data: { feeTokenID: '0000000100000000' } } });
jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux');

  return {
    __esModule: true,
    ...originalModule,
    useSelector: jest.fn(() => ({
      ...mockNonMigrated,
      staking: {},
    })),
  };
});

window.open = jest.fn();

describe('Reclaim balance screen', () => {
  let props;

  useGetInitializationFees.mockReturnValue({
    isAccountInitialized: true,
    initializationFees: { userAccount: 5000000 },
  });

  beforeEach(() => {
    props = {
      t: (v) => v,
      history: {
        push: jest.fn(),
      },
    };
  });

  it('should render legacy and new addresses', async () => {
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
      tokenID,
    });
  });

  it('Calls windows.open', () => {
    useSelector.mockImplementation(
      jest.fn(() => ({
        ...mockNonMigrated,
        token: [],
        staking: {},
      }))
    );

    const wrapper = mountWithRouterAndQueryClient(Reclaim, props, {});
    wrapper.find('.link').at(0).simulate('click');
    expect(window.open).toHaveBeenNthCalledWith(
      1,
      'https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration#MigrateanunitiliazedAccount',
      '_blank',
      'rel=noopener noreferrer'
    );
  });

  it('should not have the first step displayed if balance is above dust threshold', () => {
    useSelector.mockImplementation(
      jest.fn(() => ({
        ...mockNonMigrated,
        token: [{ name: 'Lisk', symbol: 'LSK', availableBalance: '100000000' }],
        staking: {},
      }))
    );

    const wrapper = mountWithRouterAndQueryClient(Reclaim, props, {});
    expect(wrapper.find('li.step').at(1)).toEqual({});
  });
});
