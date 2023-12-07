import { fireEvent, screen } from '@testing-library/react';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { useBlockchainApplicationExplore } from '../../hooks/queries/useBlockchainApplicationExplore';
import { mockBlockchainApp } from '../../__fixtures__';
import BlockchainApplicationList from './BlockchainApplicationList';

const mockTogglePin = jest.fn();
const mockedPins = [mockBlockchainApp.data[0].chainID];
const mockApplyFilters = jest.fn();
const mockFetchNextPage = jest.fn();

jest.useFakeTimers();
jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.mock('../../hooks/queries/useBlockchainApplicationExplore');
jest.mock('@common/hooks/useFilter', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    applyFilters: mockApplyFilters,
  })),
}));

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

describe('BlockchainApplicationList', () => {
  beforeEach(() => {
    useBlockchainApplicationExplore.mockReturnValue({
      data: mockBlockchainApp,
      error: undefined,
      isLoading: false,
      isFetching: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
    });
    useBlockchainApplicationMeta.mockReturnValue({
      data: { ...mockBlockchainAppMeta, data: mockBlockchainAppMeta.data.slice(0, 2) },
      error: undefined,
      isLoading: false,
      isFetching: false,
    });
    renderWithRouterAndQueryClient(BlockchainApplicationList);
  });

  it('should display properly', () => {
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Chain ID')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('LSK deposited')).toBeTruthy();
  });

  it('should display the right number of applications', () => {
    const blockchainAppRow = screen.getAllByTestId('applications-row');
    expect(blockchainAppRow).toHaveLength(2);
  });

  it('should not show search when less than 6 applications', () => {
    expect(() => screen.getByAltText('application-filter')).toThrow();
  });

  it('should apply search filter', () => {
    useBlockchainApplicationExplore.mockReturnValue({
      data: {
        data: [...mockBlockchainApp.data, ...mockBlockchainApp.data, ...mockBlockchainApp.data],
      },
      error: undefined,
      isLoading: false,
      isFetching: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
    });
    renderWithRouterAndQueryClient(BlockchainApplicationList);
    const searchField = screen.getByTestId('application-filter');
    fireEvent.change(searchField, { target: { value: 'test' } });
    jest.runOnlyPendingTimers();

    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'test',
        offset: 0,
      })
    );
  });

  it('should invoke the load more action', () => {
    fireEvent.click(screen.getByText('Load more'));
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });
});
