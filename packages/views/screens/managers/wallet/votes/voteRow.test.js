import { mountWithRouter } from '@common/utilities/testHelpers';
import Spinner from '@basics/spinner';
import DialogLink from '@basics/dialog/link';
import VoteRow from './voteRow';
import accounts from '../../../../../../tests/constants/accounts';

describe('VoteRow Component', () => {
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
    wrapper = mountWithRouter(VoteRow, { ...props, data: { ...props.data, pending: {} } });
    expect(wrapper.contains(Spinner)).toBeTruthy();
  });

  it('should render edit link', () => {
    wrapper = mountWithRouter(VoteRow, props);
    expect(wrapper.find(DialogLink).html()).toContain('editVoteLink');
  });

  it('should call onRowClick', () => {
    wrapper = mountWithRouter(VoteRow, props);
    wrapper.find('.vote-row').childAt(0).simulate('click');
    expect(props.onRowClick).toHaveBeenCalledTimes(1);
  });
});
