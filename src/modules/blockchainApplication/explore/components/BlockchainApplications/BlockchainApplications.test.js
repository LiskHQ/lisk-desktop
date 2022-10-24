import { screen } from '@testing-library/react';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { useBlockchainApplicationExplore } from '../../hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationStatistics } from '../../hooks/queries/useBlockchainApplicationStatistics';
import { mockBlockchainApp, mockBlockchainAppStatistics } from '../../__fixtures__';
import BlockchainApplications from './BlockchainApplications';

const mockTogglePin = jest.fn();
const mockedPins = [mockBlockchainApp.data[0].chainID];
const mockApplyFilters = jest.fn();
const mockFetchNextPage = jest.fn();

jest.useFakeTimers();
jest.mock('../../../manage/hooks/usePinBlockchainApplication');
jest.mock('../../hooks/queries/useBlockchainApplicationExplore');
jest.mock('../../hooks/queries/useBlockchainApplicationStatistics');
jest.mock('@common/hooks', () => ({
  ...jest.requireActual('@common/hooks'),
  useFilter: jest.fn(() => ({
    applyFilters: mockApplyFilters,
  })),
}));

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useBlockchainApplicationExplore.mockReturnValue({
  data: mockBlockchainApp,
  error: undefined,
  isLoading: false,
  isFetching: false,
  hasNextPage: true,
  fetchNextPage: mockFetchNextPage,
});

useBlockchainApplicationStatistics.mockReturnValue({
  data: mockBlockchainAppStatistics,
  error: undefined,
  isLoading: false,
  isFetching: false,
  hasNextPage: true,
  fetchNextPage: mockFetchNextPage,
});

describe('BlockchainApplications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouterAndQueryClient(BlockchainApplications, {});
  });

  it('should display properly', () => {
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Chain ID')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('LSK deposited')).toBeTruthy();
    expect(screen.getByText('Applications')).toBeTruthy();

    expect(screen.getByText('Total Supply')).toBeTruthy();
    expect(screen.getByText('Staked')).toBeTruthy();
    expect(screen.getByText('5,000,000 LSK')).toBeTruthy();
    expect(screen.getByText('3,000,000 LSK')).toBeTruthy();
  });
});
