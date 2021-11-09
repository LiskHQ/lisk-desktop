import { mountWithRouter } from '@utils/testHelpers';
import { routes } from '@constants';
import accounts from '../../../../../test/constants/accounts';
import Votes from './votes';

describe('Votes Tab Component', () => {
  let wrapper;
  const props = {
    votes: {
      data: [],
      loadData: jest.fn(),
    },
    accounts: {
      data: {},
      loadData: jest.fn(),
    },
    address: accounts.genesis.summary.address,
    t: v => v,
    history: { push: jest.fn() },
  };
  const votes = {
    ...props.votes,
    data: [...Array(10)].map((_, i) => ({
      username: `user_${i}`,
      address: `lsk${i}`,
      rank: i + 1,
      rewards: '40500000000',
      productivity: Math.random() * 100,
      vote: '9999988456732672',
    })),
  };

  afterEach(() => {
    props.votes.loadData.mockRestore();
    props.accounts.loadData.mockRestore();
  });

  const setup = customProps => mountWithRouter(Votes, customProps);

  it('Should render with empty state', () => {
    wrapper = setup(props);
    expect(wrapper.find('.empty-state')).toIncludeText('This account doesn’t have any votes.');
  });

  it('Should show loading state', () => {
    wrapper = setup({ ...props, votes: { ...props.votes, isLoading: true } });
    expect(wrapper).toContainMatchingElement('.loading');
  });

  it('Should render votes', () => {
    const customProps = {
      ...props,
      votes,
    };
    wrapper = setup(customProps);
    expect(wrapper).toContainMatchingElements(10, 'VoteRow');
  });

  it('Should go to account page on clicking row', () => {
    const customProps = {
      ...props,
      votes,
    };
    wrapper = setup(customProps);
    wrapper.find('.vote-row').at(0).simulate('click');
    jest.advanceTimersByTime(300);
    expect(props.history.push).toBeCalledWith(`${routes.account.path}?address=lsk0`);
  });

  it('Should filter votes per username and show error message if no results found', () => {
    const customProps = {
      ...props,
      votes,
    };
    wrapper = setup(customProps);
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'user_1' } });
    jest.advanceTimersByTime(300);
    expect(wrapper).toContainMatchingElements(1, '.vote-row');
    wrapper.find('.filterHolder input').simulate('change', { target: { value: 'not user name' } });
    jest.advanceTimersByTime(300);
    expect(wrapper).toContainMatchingElements(1, 'Empty');
  });
});
