import { mountWithRouter } from 'src/utils/testHelpers';
import Spinner from '@theme/Spinner';
import DialogLink from '@theme/dialog/link';
import accounts from '@tests/constants/wallets';
import StakeRow from './stakeRow';

describe('StakeRow Component', () => {
  let wrapper;
  const props = {
    data: {
      address: accounts.delegate.summary.address,
      delegate: accounts.delegate,
    },
    onRowClick: jest.fn(),
    accounts: {
      [accounts.delegate.summary.address]: {
        summary: {
          address: accounts.delegate.summary.address,
          balance: '99994688951000',
        },
        dpos: {
          delegate: {
            productivity: '0',
            rank: 0,
            rewards: '0',
            username: 'free',
            vote: '10000000000',
          },
        },
      },
    },
  };

  it('should render spinner', () => {
    wrapper = mountWithRouter(StakeRow, {
      ...props,
      data: { ...props.data, pending: {} },
    });
    expect(wrapper.contains(Spinner)).toBeTruthy();
  });

  it('should render edit link', () => {
    wrapper = mountWithRouter(StakeRow, props);
    expect(wrapper.find(DialogLink).html()).toContain('editStakeLink');
  });

  it('should call onRowClick', () => {
    wrapper = mountWithRouter(StakeRow, props);
    wrapper.find('.vote-row').childAt(0).simulate('click');
    expect(props.onRowClick).toHaveBeenCalledTimes(1);
  });
});
