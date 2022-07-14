import { screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import { renderWithRouter } from 'src/utils/testHelpers';
import BlockchainApplications from './BlockchainApplications';

jest.useFakeTimers();
jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
const mockTogglePin = jest.fn();
const mockedPins = [mockBlockchainApplications[0].chainID];

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

describe('BlockchainApplicationList', () => {
  let wrapper;
  const props = {
    applyFilters: jest.fn(),
    filters: jest.fn(),
    applications: {
      data: mockBlockchainApplications,
      isLoading: true,
      loadData: jest.fn(),
      error: false,
    },
    statistics: {
      data: {
        registered: 101,
        active: 53,
        terminated: 9,
        totalSupplyLSK: '5000000',
        stakedLSK: '3000000',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = renderWithRouter(BlockchainApplications, props);
  });

  it('should display properly', () => {
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Chain Id')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('LSK deposited')).toBeTruthy();
    expect(screen.getByText('Applications')).toBeTruthy();

    expect(screen.getByText('Total Supply')).toBeTruthy();
    expect(screen.getByText('Staked')).toBeTruthy();
    expect(screen.getByText('5,000,000 LSK')).toBeTruthy();
    expect(screen.getByText('3,000,000 LSK')).toBeTruthy();
  });
});
