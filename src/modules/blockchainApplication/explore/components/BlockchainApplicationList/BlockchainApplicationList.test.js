import { fireEvent, screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplications';
import { renderWithRouter } from 'src/utils/testHelpers';
import BlockchainApplicationList from './BlockchainApplicationList';
import { BLOCKCHAIN_APPLICATION_LIST_LIMIT } from '../../const/constants';

jest.useFakeTimers();

describe('BlockchainApplicationList', () => {
  const props = {
    applyFilters: jest.fn(),
    filters: jest.fn(),
    applications: {
      data: mockBlockchainApplications,
      isLoading: true,
      loadData: jest.fn(),
      error: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(BlockchainApplicationList, props);
  });

  it('should display properly', () => {
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Chain Id')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('LSK deposited')).toBeTruthy();
    expect(screen.getByText('Applications')).toBeTruthy();
  });

  it('should display the right number of applications', () => {
    const blockchainAppRow = screen.getAllByTestId('applications-row');
    expect(blockchainAppRow).toHaveLength(1);
  });

  it('should apply search filter', () => {
    const searchField = screen.getByTestId('application-filter');
    fireEvent.change(searchField, { target: { value: 'test' } });
    jest.runAllTimers();

    expect(props.applyFilters).toHaveBeenCalledWith(expect.objectContaining({
      search: 'test',
      offset: 0,
      limit: BLOCKCHAIN_APPLICATION_LIST_LIMIT,
    }));
  });
});
