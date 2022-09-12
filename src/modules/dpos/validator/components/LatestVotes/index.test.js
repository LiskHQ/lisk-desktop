import { mountWithRouter } from 'src/utils/testHelpers';
import { delegateList } from '@tests/constants/delegates';
import { mockTransactions } from 'src/modules/transaction/__fixtures__';
import { useTransactions } from 'src/modules/transaction/hooks/queries';
import { useDelegates } from '../../hooks/queries';
import LatestVotes from './index';
import { mockDelegates } from '../../__fixtures__';

const delegateDataList = delegateList(10);

jest.mock('src/modules/transaction/hooks/queries');
jest.mock('../../hooks/queries');

describe('Latest votes', () => {
  const mockFetchNextDelegates = jest.fn();
  const mockFetchNextTranactions = jest.fn();
  const props = {
    filters: {},
  };

  it('displays initial table of votes', () => {
    useDelegates.mockReturnValue({
      data: mockDelegates,
      isFetching: false,
      fetchNextPage: mockFetchNextDelegates,
      hasNextPage: false,
    });
    useTransactions.mockReturnValue({
      data: { ...mockTransactions, data: mockTransactions.data.slice(0, 10) },
      isFetching: false,
      fetchNextPage: mockFetchNextTranactions,
      hasNextPage: false,
    });
    const wrapper = mountWithRouter(LatestVotes, props);
    expect(wrapper.find('.transactions-row').hostNodes()).toHaveLength(10);
  });

  it('can load more votes if possible', () => {
    useDelegates.mockReturnValue({
      data: mockDelegates,
      isFetching: false,
      fetchNextPage: mockFetchNextDelegates,
      hasNextPage: false,
    });
    useTransactions.mockReturnValue({
      data: { ...mockTransactions, data: mockTransactions.data.slice(0, 10) },
      isFetching: false,
      fetchNextPage: mockFetchNextTranactions,
      hasNextPage: true,
    });

    const wrapper = mountWithRouter(LatestVotes);
    expect(wrapper.find('.load-more')).toExist();
    wrapper.find('.load-more').first().simulate('click');
    expect(mockFetchNextTranactions).toHaveBeenCalledTimes(1);
  });

  it('can not load more votes if meta property is unavailable', () => {
    useDelegates.mockReturnValue({
      isFetching: false,
      fetchNextPage: mockFetchNextDelegates,
      hasNextPage: false,
    });
    useTransactions.mockReturnValue({
      isFetching: false,
      fetchNextPage: mockFetchNextTranactions,
    });

    const wrapper = mountWithRouter(LatestVotes);
    expect(wrapper.find('.load-more')).not.toExist();
  });
});
