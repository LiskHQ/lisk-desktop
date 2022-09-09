import { mountWithRouter } from 'src/utils/testHelpers';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { useCurrentApplication } from 'src/modules/blockchainApplication/manage/hooks';
import BlockDetails from './BlockDetailsTransactions';
import { useTransactions } from '../../hooks/queries';
import { mockTransactions } from '../../__fixtures__';

const mockSetApplication = jest.fn();
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('../../hooks/queries');

useCurrentApplication.mockReturnValue([mockManagedApplications[1], mockSetApplication]);

describe('BlockDetails page', () => {
  let wrapper;
  const mockFetchNextPage = jest.fn();

  const props = {
    t: (key) => key,
    height: 1,
    blockId: 1,
  };

  it('renders a page with error', () => {
    const error = 'Failed to load block details.';
    useTransactions.mockReturnValue({
      error,
      data: { data: undefined },
      isLoading: false,
      hasNextPage: false,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
    });
    wrapper = mountWithRouter(BlockDetails, props);
    expect(wrapper.find('Error').at(0)).toHaveText(error);
  });

  it('renders a page with transaction list', () => {
    useTransactions.mockReturnValue({
      data: { data: undefined },
      isLoading: false,
      error: undefined,
      hasNextPage: false,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
    });
    wrapper = mountWithRouter(BlockDetails, props);
    expect(wrapper.find('TransactionRow')).toHaveLength(0);

    useTransactions.mockReturnValue({
      data: mockTransactions,
      isLoading: true,
      error: undefined,
      hasNextPage: true,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
    });
    wrapper = mountWithRouter(BlockDetails, props);
    expect(wrapper.find('TransactionRow')).toHaveLength(mockTransactions.data.length);
  });

  it('shows a message when empty transactions response', () => {
    const error = 'error';
    useTransactions.mockReturnValue({
      error,
      data: { data: undefined },
      isLoading: false,
      hasNextPage: false,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
    });
    wrapper = mountWithRouter(BlockDetails, props);
    expect(wrapper.find('Empty')).toHaveLength(1);
  });
});
