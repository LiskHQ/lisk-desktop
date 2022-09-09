import { useSelector } from 'react-redux';
import { truncateAddress } from '@wallet/utils/account';
import { mountWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import wallets from '@tests/constants/wallets';
import Reclaim from './index';
import styles from './reclaim.css';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));

const mockNonMigrated = wallets.non_migrated;

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux');

  return {
    __esModule: true,
    ...originalModule,
    useSelector: jest.fn(() => ({
      ...mockNonMigrated,
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
    const wrapper = mountWithRouter(Reclaim, props, {});
    const html = wrapper.html();
    expect(html).toContain(wallets.non_migrated.legacy.address);
    expect(html).toContain(truncateAddress(wallets.non_migrated.summary.address, 'medium'));
  });

  it('Opens send modal', () => {
    const wrapper = mountWithRouter(Reclaim, props, {});
    wrapper.find(styles.button).first().simulate('click');
    expect(addSearchParamsToUrl).toHaveBeenNthCalledWith(1, expect.objectContaining({}), {
      modal: 'reclaimBalance',
    });
  });

  it('Calls windows.open', () => {
    useSelector.mockImplementation(
      jest.fn(() => ({
        ...mockNonMigrated,
        token: { balance: 0 },
      }))
    );

    const wrapper = mountWithRouter(Reclaim, props, {});
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
});
