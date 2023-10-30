import { mountWithRouter } from 'src/utils/testHelpers';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { useNetworkSupportedTokens, useTokenBalances } from '@token/fungible/hooks/queries';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { mockBlocks } from '@block/__fixtures__';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import BlockDetails from './BlockDetailsTransactions';
import { useTransactions } from '../../hooks/queries';
import { mockTransactions } from '../../__fixtures__';

const mockSetApplication = jest.fn();
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('../../hooks/queries');
jest.mock('@block/hooks/queries/useLatestBlock');
jest.mock('@token/fungible/hooks/queries');

useTokenBalances.mockReturnValue({ data: mockAppsTokens.data[0] });
useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });
useCurrentApplication.mockReturnValue([mockManagedApplications[1], mockSetApplication]);
useNetworkSupportedTokens.mockReturnValue({ data: mockAppsTokens.data });

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
