import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import { truncateAddress } from '@wallet/utils/account';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { tokenMap } from '@token/fungible/consts/tokens';
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
      passphrase: 'test',
      info: {
        LSK: mockNonMigrated,
      },
    })),
  };
});

describe('Reclaim balance screen', () => {
  let props;
  const state = {
    wallet: {
      passphrase: 'test',
      info: {
        LSK: wallets.non_migrated,
      },
    },
    settings: { token: { active: tokenMap.LSK.key } },
  };

  beforeEach(() => {
    props = {
      t: v => v,
      history: {
        push: jest.fn(),
      },
    };
  });

  it('should render legacy and new addresses', () => {
    const wrapper = mountWithRouterAndStore(Reclaim, props, {}, state);
    const html = wrapper.html();
    expect(html).toContain(wallets.non_migrated.legacy.address);
    expect(html).toContain(truncateAddress(wallets.non_migrated.summary.address, 'medium'));
  });

  it('Opens send modal', () => {
    const wrapper = mountWithRouterAndStore(Reclaim, props, {}, state);
    wrapper.find(styles.button).first().simulate('click');
    expect(
      addSearchParamsToUrl,
    ).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ }),
      { modal: 'reclaimBalance' },
    );
  });
});
