import moment from 'moment';
import { fireEvent, screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { useApplicationManagement, usePinBlockchainApplication } from '@blockchainApplication/manage/hooks';
import { useBlockchainApplicationMeta } from 'src/modules/blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import useApplicationsQuery from '../../hooks/queries/useApplicationsQuery';
import BlockchainApplicationDetails from './index';
import { mockBlockchainApp } from '../../__fixtures__';

const mockedPins = ['1111'];
const mockTogglePin = jest.fn();
const mockSetApplication = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.mock('../../hooks/queries/useApplicationsQuery');

useBlockchainApplicationMeta.mockReturnValue({
  data: {
    data: mockBlockchainApplications
  }
})

useApplicationsQuery.mockReturnValue({
  data: {
    data: mockBlockchainApp.data
  }
})

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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouterAndQueryClient(BlockchainApplicationDetails, props);
  });

  it('should display properly', () => {
    const {
      chainName,
    } = mockBlockchainApplications[0];

    const { state, lastCertificateHeight, lastUpdated } = mockBlockchainApp.data[0]

    expect(screen.getByText(chainName)).toBeTruthy();
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

    renderWithRouterAndQueryClient(BlockchainApplicationDetails, props);
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
    renderWithRouterAndQueryClient(BlockchainApplicationDetails, updatedProps);
    expect(screen.getByTestId('add-application-button')).toBeTruthy();
    fireEvent.click(screen.getByTestId('add-application-button'));
    expect(mockSetApplication).toHaveBeenCalledWith(mockBlockchainApplications[0]);
  });
});
