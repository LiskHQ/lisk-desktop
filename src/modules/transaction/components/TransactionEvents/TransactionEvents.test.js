import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useFilter } from 'src/modules/common/hooks';
import { mockEvents } from '../../__fixtures__';
import TransactionEvents from './TransactionEvents';
import { useTransactionEvents } from '../../hooks/queries';

const mockSetApplication = jest.fn();
const mockClearFilters = jest.fn();
const mockApplyFilters = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('../../hooks/queries');
jest.mock('src/modules/common/hooks');

useCurrentApplication.mockReturnValue([mockManagedApplications[1], mockSetApplication]);

describe('TransactionEvents', () => {
  const mockFetchNextPage = jest.fn();
  let wrapper;
  const props = {
    blockId: 1,
    address: 'lskhbxua8tpdckcewntcttfqfo4rbatampo2dgrno',
  };

  useTransactionEvents.mockReturnValue({
    data: { data: mockEvents.data.slice(0, 20) },
    isLoading: true,
    error: undefined,
    hasNextPage: true,
    isFetching: false,
    fetchNextPage: mockFetchNextPage,
  });

  useFilter.mockReturnValue({
    filters: { dateFrom: '', dateTo: '' },
    applyFilters: mockApplyFilters,
    clearFilters: mockClearFilters,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = renderWithQueryClient(TransactionEvents, props);
  });

  it('should display properly', async () => {
    expect(screen.getByText('Index')).toBeTruthy();
    expect(screen.getByText('Module')).toBeTruthy();
    expect(screen.getByText('Name')).toBeTruthy();

    mockEvents.data.slice(0, 20).forEach((item) => {
      expect(screen.queryAllByText(item.index)).toBeTruthy();
      expect(screen.queryAllByText(item.name)).toBeTruthy();
      expect(screen.queryAllByText(item.module)).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Load more'));

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  it('should display properly in wallet mode', async () => {
    wrapper.rerender(<TransactionEvents {...props} isWallet />);

    expect(screen.getByText('Block height')).toBeTruthy();
    expect(screen.getByText('Transaction ID')).toBeTruthy();
    expect(screen.getByText('Module')).toBeTruthy();
    expect(screen.getByText('Name')).toBeTruthy();

    mockEvents.data.slice(0, 20).forEach((item) => {
      expect(screen.queryAllByText(item.block.height)).toBeTruthy();
      expect(screen.queryAllByText(item.topics[0])).toBeTruthy();
      expect(screen.queryAllByText(item.name)).toBeTruthy();
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
      error: { response: { status: 404 } },
      hasNextPage: false,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
    });
    wrapper.rerender(<TransactionEvents {...props} />);

    expect(wrapper.getByText('There are no events for this account.')).toBeTruthy();
  });

  it('should display filter fields', async () => {
    render(<TransactionEvents {...props} hasFilter />);

    fireEvent.click(screen.queryByText('Filter'));

    expect(screen.getByText('Transaction ID')).toBeTruthy();
    expect(screen.getByText('Block ID')).toBeTruthy();
    expect(screen.getByText('Block height')).toBeTruthy();
  });

  it('should render based on provided filters', async () => {
    wrapper = render(<TransactionEvents {...props} isWallet hasFilter />);
    const transactionIdField = screen.getByTestId('transactionID');
    const blockHeightField = screen.getByTestId('height');
    const blockID = screen.getByTestId('blockID');
    const filters = {
      transactionID: '1234',
      height: '1234',
      blockID: '1234',
    };

    fireEvent.click(screen.queryByText('Filter'));
    fireEvent.change(transactionIdField, { target: { value: '1234' } });
    fireEvent.change(blockHeightField, { target: { value: '1234' } });
    fireEvent.change(blockID, { target: { value: '1234' } });

    fireEvent.click(screen.getByText('Apply filters'));

    await waitFor(() => {
      expect(mockApplyFilters).toHaveBeenCalledWith({
        dateFrom: '',
        dateTo: '',
        ...filters,
      });
    });

    useFilter.mockReturnValue({
      filters,
      applyFilters: mockApplyFilters,
      clearFilters: mockClearFilters,
    });

    wrapper.rerender(<TransactionEvents {...props} isWallet hasFilter />);

    fireEvent.click(screen.getByTestId('transactionID-filter'));
    await waitFor(() => {
      expect(mockClearFilters).toHaveBeenCalledWith(['transactionID']);
    });

    fireEvent.click(screen.getByText('Clear all filters'));
    await waitFor(() => {
      expect(mockClearFilters).toHaveBeenCalled();
    });
  });
});
