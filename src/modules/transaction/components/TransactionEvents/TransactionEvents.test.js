import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockEvents } from '../../__fixtures__';
import TransactionEvents from './TransactionEvents';
import { useTransactionEvents } from '../../hooks/queries';

const mockSetApplication = jest.fn();
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('../../hooks/queries');

useCurrentApplication.mockReturnValue([mockManagedApplications[1], mockSetApplication]);

describe('TransactionEvents', () => {
  const queryClient = new QueryClient();
  const mockFetchNextPage = jest.fn();
  let wrapper;
  const props = {
    blockId: 1,
  };

  useTransactionEvents.mockReturnValue({
    data: { data: mockEvents.data.slice(0, 20) },
    isLoading: true,
    error: undefined,
    hasNextPage: true,
    isFetching: false,
    fetchNextPage: mockFetchNextPage,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = renderWithQueryClient(TransactionEvents, props);
  });

  it('should display properly', async () => {
    expect(screen.getByText('Index')).toBeTruthy();
    expect(screen.getByText('ID')).toBeTruthy();
    expect(screen.getByText('Module')).toBeTruthy();
    expect(screen.getByText('Type ID')).toBeTruthy();

    mockEvents.data.slice(0, 20).forEach((item) => {
      expect(screen.queryAllByText(item.id)).toBeTruthy();
      expect(screen.queryAllByText(item.index)).toBeTruthy();
      expect(screen.queryAllByText(item.typeID)).toBeTruthy();
      expect(screen.queryAllByText(item.module)).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Load more'));

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  it('should display empty state text', async () => {
    useTransactionEvents.mockReturnValue({
      isLoading: true,
      error: undefined,
      hasNextPage: false,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
    });
    wrapper.rerender(
      <QueryClientProvider client={queryClient}>
        <TransactionEvents {...props} />
      </QueryClientProvider>
    );

    expect(wrapper.getByText('There are no transaction events')).toBeTruthy();
  });
});
