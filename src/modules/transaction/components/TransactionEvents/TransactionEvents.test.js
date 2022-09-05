import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import {
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { mockEvents } from '../../__fixtures__';
import TransactionEvents from './TransactionEvents';
import { useTransactionEvents } from '../../hooks/queries';

const mockSetApplication = jest.fn();
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('../../hooks/queries');

useCurrentApplication.mockReturnValue([
  mockManagedApplications[1],
  mockSetApplication,
]);

describe('TransactionEvents', () => {
  const mockFetchNextPage = jest.fn();
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
    renderWithQueryClient(TransactionEvents, props);
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

    fireEvent.click(screen.getByText('Load More'));

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  it('should display empty state text', async () => {
    useTransactionEvents.mockReturnValue({
      isLoading: true,
      error: undefined,
      hasNextPage: true,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
    });
    renderWithQueryClient(TransactionEvents, props);
    expect(screen.getByText('There are no Transaction Events')).toBeTruthy();
  });
});
