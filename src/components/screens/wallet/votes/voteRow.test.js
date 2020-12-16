import { mountWithRouter } from '../../../../utils/testHelpers';
import VoteRow from './voteRow';
import accounts from '../../../../../test/constants/accounts';
import Spinner from '../../../toolbox/spinner';
import DialogLink from '../../../toolbox/dialog/link';

describe('VoteRow Component', () => {
  let wrapper;
  const props = {
    data: {
      address: accounts.delegate.address,
    },
    onRowClick: jest.fn(),
    delegates: {
      [accounts.delegate.address]: {
        productivity: 95,
        rank: 1,
        totalVotesReceived: 50e8,
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
