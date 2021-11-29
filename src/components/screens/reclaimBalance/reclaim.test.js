import { mountWithRouterAndStore } from '@utils/testHelpers';
import { truncateAddress } from '@utils/account';
import { addSearchParamsToUrl } from '@utils/searchParams';
import { tokenMap } from '@constants';
import Reclaim from './reclaim';
import styles from './index.css';
import accounts from '../../../../test/constants/accounts';

jest.mock('@utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));

describe('Reclaim balance screen', () => {
  let props;
  const state = {
    account: {
      passphrase: 'test',
      info: {
        LSK: accounts.non_migrated,
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
    expect(html).toContain(accounts.non_migrated.legacy.address);
    expect(html).toContain(truncateAddress(accounts.non_migrated.summary.address, 'medium'));
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
