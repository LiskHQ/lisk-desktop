import moment from 'moment';
import { fireEvent, screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { renderWithRouter } from 'src/utils/testHelpers';
import { useApplicationManagement, usePinBlockchainApplication } from '@blockchainApplication/manage/hooks';
import BlockchainApplicationDetails from './index';

const mockedPins = ['1111'];
const mockTogglePin = jest.fn();
const mockSetApplication = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useApplicationManagement.mockReturnValue({
  setApplication: mockSetApplication,
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(BlockchainApplicationDetails, props);
  });

  it('should display properly', () => {
    const {
      name, state, lastCertificateHeight, lastUpdated,
    } = mockBlockchainApplications[0];

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(state)).toBeTruthy();
    expect(screen.getByText(lastCertificateHeight)).toBeTruthy();
    expect(screen.getByText(moment(lastUpdated).format('DD MMM YYYY'))).toBeTruthy();

    expect(screen.getByText('Chain ID')).toBeTruthy();
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

    renderWithRouter(BlockchainApplicationDetails, props);
    expect(screen.getByAltText('unpinnedIcon')).toBeTruthy();
  });

  it('should display add application button if in add application mode', () => {
    const updatedProps = {
      ...props,
      location: {
        ...props.location,
        search: 'chainId=test-chain-id&mode=addApplication',
      },
    };
    renderWithRouter(BlockchainApplicationDetails, updatedProps);
    expect(screen.getByTestId('add-application-button')).toBeTruthy();
    fireEvent.click(screen.getByTestId('add-application-button'));
    expect(mockSetApplication).toHaveBeenCalledWith(props.application.data);
  });
});
