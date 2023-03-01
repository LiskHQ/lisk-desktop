import moment from 'moment';
import { fireEvent, screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { renderWithRouter } from 'src/utils/testHelpers';
import { usePinBlockchainApplication, useApplicationManagement } from '@blockchainApplication/manage/hooks';
import RemoveApplicationDetails from '.';

const mockedPins = ['1111'];
const mockTogglePin = jest.fn();
const mockDeleteApplicationByChainId = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useApplicationManagement.mockReturnValue({
  deleteApplicationByChainId: mockDeleteApplicationByChainId,
});

describe('BlockchainApplicationDetails', () => {
  const props = {
    location: {
      search: 'chainId=test-chain-id',
    },
    application: {
      data: mockBlockchainApplications[0],
      isLoading: true,
      loadData: jest.fn(),
      error: false,
    },
    nextStep: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(RemoveApplicationDetails, props);
  });

  it('should display properly', () => {
    const {
      chainName, address, status, lastCertificateHeight, lastUpdated,
    } = mockBlockchainApplications[0];

    expect(screen.getByText(chainName)).toBeTruthy();
    expect(screen.getByText(address)).toBeTruthy();
    expect(screen.getByText(status)).toBeTruthy();
    expect(screen.getByText(lastCertificateHeight)).toBeTruthy();
    expect(screen.getByText(moment(lastUpdated).format('DD MMM YYYY'))).toBeTruthy();

    expect(screen.getByText('Chain ID')).toBeTruthy();
    expect(screen.getByText('Remove application')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Last Update')).toBeTruthy();
    expect(screen.getByText('Last Certificate Height')).toBeTruthy();
    expect(screen.getByText('Deposited:')).toBeTruthy();
  });

  it('should show application as pinned', () => {
    expect(screen.getByAltText('pinnedIcon')).toBeTruthy();
  });

  it('should invoke togglePin', () => {
    fireEvent.click(screen.getByTestId('pin-button'));
    expect(mockTogglePin).toHaveBeenCalledWith('test-chain-id');
  });

  it('should show application as unpinned', () => {
    usePinBlockchainApplication.mockReturnValue(
      {
        togglePin: mockTogglePin,
        pins: mockedPins,
        checkPinByChainId: jest.fn().mockReturnValue(false),
      },
    );

    renderWithRouter(RemoveApplicationDetails, props);
    expect(screen.getByAltText('unpinnedIcon')).toBeTruthy();
  });

  it('should invoke the cancel callback', () => {
    fireEvent.click(screen.getByText('Cancel'));
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('should remove blockchain application', () => {
    fireEvent.click(screen.getByText('Remove application now'));
    expect(props.nextStep)
      .toHaveBeenCalledWith(expect.objectContaining({ application: props.application }));
  });
});
