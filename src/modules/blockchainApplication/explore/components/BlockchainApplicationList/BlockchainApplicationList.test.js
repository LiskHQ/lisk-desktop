import { fireEvent, screen } from '@testing-library/react';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import {
  renderWithRouterAndQueryClient,
  rerenderWithRouterAndQueryClient,
} from 'src/utils/testHelpers';
import { useBlockchainApplicationExplore } from '../../hooks/queries/useBlockchainApplicationExplore';
import { mockBlockchainApp } from '../../__fixtures__';
import BlockchainApplicationList from './BlockchainApplicationList';

const mockTogglePin = jest.fn();
const mockedPins = [mockBlockchainApp.data[0].chainID];
const mockApplyFilters = jest.fn();
const mockFetchNextPage = jest.fn();

jest.useFakeTimers();
jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
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

useBlockchainApplicationExplore.mockReturnValue({
  data: mockBlockchainApp,
  error: undefined,
  isLoading: false,
  isFetching: false,
  hasNextPage: true,
  fetchNextPage: mockFetchNextPage,
});

describe('BlockchainApplicationList', () => {
  beforeEach(() => {
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
    expect(blockchainAppRow).toHaveLength(mockBlockchainApp.data.length);
  });

  it('should apply search filter', () => {
    const searchField = screen.getByTestId('application-filter');
    fireEvent.change(searchField, { target: { value: 'test' } });
    jest.runAllTimers();

    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'test',
        offset: 0,
      })
    );
  });

  it('should call the toggle function for the particular blockchain application been toggled', () => {
    const { chainID } = mockBlockchainApp.data[0];

    fireEvent.click(screen.getAllByTestId('pin-button')[0]);
    expect(mockTogglePin).toHaveBeenCalledWith(chainID);
  });

  it('should invoke the load more action', () => {
    fireEvent.click(screen.getByText('Load more'));
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should not have any pinned application', () => {
    usePinBlockchainApplication.mockReturnValue({
      togglePin: mockTogglePin,
      pins: [],
      checkPinByChainId: jest.fn().mockReturnValue(false),
    });
    rerenderWithRouterAndQueryClient(BlockchainApplicationList);

    expect(screen.getAllByAltText('unpinnedIcon')).toHaveLength(mockBlockchainApp.data.length);
  });
});
