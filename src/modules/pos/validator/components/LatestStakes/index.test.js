import { mountWithRouter } from 'src/utils/testHelpers';
import { mockTransactions } from 'src/modules/transaction/__fixtures__';
import { useTransactions } from 'src/modules/transaction/hooks/queries';
import { useValidators } from '../../hooks/queries';
import LatestStakes from './index';
import { mockValidators } from '../../__fixtures__';

jest.mock('src/modules/transaction/hooks/queries');
jest.mock('../../hooks/queries');

describe('Latest stakes', () => {
  const mockFetchNextValidators = jest.fn();
  const mockFetchNextTransactions = jest.fn();
  const props = {
    filters: {},
  };

  it('displays initial table of stakes', () => {
    useValidators.mockReturnValue({
      data: mockValidators,
      isFetching: false,
      fetchNextPage: mockFetchNextValidators,
      hasNextPage: false,
    });
    useTransactions.mockReturnValue({
      data: { ...mockTransactions, data: mockTransactions.data.slice(0, 10) },
      isFetching: false,
      fetchNextPage: mockFetchNextTransactions,
      hasNextPage: false,
    });
    const wrapper = mountWithRouter(LatestStakes, props);
    expect(wrapper.find('.transactions-row').hostNodes()).toHaveLength(10);
  });

  it('can load more stakes if possible', () => {
    useValidators.mockReturnValue({
      data: mockValidators,
      isFetching: false,
      fetchNextPage: mockFetchNextValidators,
      hasNextPage: false,
    });
    useTransactions.mockReturnValue({
      data: { ...mockTransactions, data: mockTransactions.data.slice(0, 10) },
      isFetching: false,
      fetchNextPage: mockFetchNextTransactions,
      hasNextPage: true,
    });

    const wrapper = mountWithRouter(LatestStakes);
    expect(wrapper.find('.load-more')).toExist();
    wrapper.find('.load-more').first().simulate('click');
    expect(mockFetchNextTransactions).toHaveBeenCalledTimes(1);
  });

  it('can not load more stakes if meta property is unavailable', () => {
    useValidators.mockReturnValue({
      isFetching: false,
      fetchNextPage: mockFetchNextValidators,
      hasNextPage: false,
    });
    useTransactions.mockReturnValue({
      isFetching: false,
      fetchNextPage: mockFetchNextTransactions,
    });

    const wrapper = mountWithRouter(LatestStakes);
    expect(wrapper.find('.load-more')).not.toExist();
  });
});
