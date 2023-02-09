import { mountWithRouter } from 'src/utils/testHelpers';
import Spinner from '@theme/Spinner';
import DialogLink from '@theme/dialog/link';
import accounts from '@tests/constants/wallets';
import StakeRow from './stakeRow';

describe('StakeRow Component', () => {
  let wrapper;
  const props = {
    data: {
      address: accounts.validator.summary.address,
      validator: accounts.validator,
    },
    onRowClick: jest.fn(),
    accounts: {
      [accounts.validator.summary.address]: {
        summary: {
          address: accounts.validator.summary.address,
          balance: '99994688951000',
        },
        pos: {
          validator: {
            productivity: '0',
            rank: 0,
            rewards: '0',
            username: 'free',
            stake: '10000000000',
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
    wrapper.find('.stake-row').childAt(0).simulate('click');
    expect(props.onRowClick).toHaveBeenCalledTimes(1);
  });
});
