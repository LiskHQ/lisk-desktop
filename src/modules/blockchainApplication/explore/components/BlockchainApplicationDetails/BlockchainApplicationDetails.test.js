import moment from 'moment';
import { fireEvent, screen } from '@testing-library/react';
import {
  renderWithRouterAndQueryClient,
  rerenderWithRouterAndQueryClient,
} from 'src/utils/testHelpers';
import {
  useApplicationManagement,
  usePinBlockchainApplication,
} from '@blockchainApplication/manage/hooks';
import { useBlockchainApplicationMeta } from 'src/modules/blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { useBlockchainApplicationExplore } from '../../hooks/queries/useBlockchainApplicationExplore';
import { mockBlockchainApp } from '../../__fixtures__';
import { mockBlockchainAppMeta } from '../../../manage/__fixtures__';
import BlockchainApplicationDetails from './index';

const mockedPins = ['1111'];
const mockTogglePin = jest.fn();
const mockSetApplication = jest.fn();
const mockRefetchOnChainData = jest.fn();
const mockRefetchOffChainData = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('../../hooks/queries/useBlockchainApplicationExplore');
useBlockchainApplicationExplore.mockReturnValue({
  data: { data: mockBlockchainApp.data },
  isLoading: false,
  isError: undefined,
});
jest.mock('../../../manage/hooks/queries/useBlockchainApplicationMeta');
useBlockchainApplicationMeta.mockReturnValue({
  data: { data: mockBlockchainAppMeta.data },
  isLoading: false,
  isError: undefined,
});

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useApplicationManagement.mockReturnValue({
  setApplication: mockSetApplication,
});
const aggregatedApplicationData = {
  ...mockBlockchainApp.data[0],
  ...mockBlockchainAppMeta.data[0],
};

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
    const { name, status, lastCertificateHeight, lastUpdated } = mockBlockchainApp.data[0];
    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(status)).toBeTruthy();
    expect(screen.getByText(lastCertificateHeight)).toBeTruthy();
    expect(screen.getByText(moment(lastUpdated * 1000).format('DD MMM YYYY'))).toBeTruthy();

    expect(screen.getByText('Chain ID')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Last Update')).toBeTruthy();
    expect(screen.getByText('Last Certificate Height')).toBeTruthy();
    expect(screen.getByText('Deposited:')).toBeTruthy();
  });

  it('should display loading screen during loading', () => {
    useBlockchainApplicationExplore.mockReturnValue({
      data: { data: [] },
      isLoading: true,
      isError: undefined,
    });
    useBlockchainApplicationMeta.mockReturnValue({
      data: { data: [] },
      isLoading: true,
      isError: undefined,
    });
    renderWithRouterAndQueryClient(BlockchainApplicationDetails, props);

    expect(screen.getAllByTestId('skeleton-wrapper')).toHaveLength(12);
  });

  it('should display error screen for API errors', () => {
    useBlockchainApplicationExplore.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: true,
      refetch: mockRefetchOnChainData,
    });
    useBlockchainApplicationMeta.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: true,
      refetch: mockRefetchOffChainData,
    });
    renderWithRouterAndQueryClient(BlockchainApplicationDetails, props);

    fireEvent.click(screen.getByText('Try again'));
    expect(mockRefetchOnChainData).toHaveBeenCalledTimes(1);
    expect(mockRefetchOffChainData).toHaveBeenCalledTimes(1);
  });

  it('should show application as pinned', () => {
    useBlockchainApplicationExplore.mockReturnValue({
      data: { data: mockBlockchainApp.data },
      isLoading: false,
      isError: undefined,
    });
    useBlockchainApplicationMeta.mockReturnValue({
      data: { data: mockBlockchainAppMeta.data },
      isLoading: false,
      isError: undefined,
    });
    renderWithRouterAndQueryClient(BlockchainApplicationDetails, props);
    expect(screen.getByAltText('pinnedIcon')).toBeTruthy();
  });

  it('should invoke togglePin', () => {
    fireEvent.click(screen.getByTestId('pin-button'));
    expect(mockTogglePin).toHaveBeenCalledWith('test-chain-id');
  });

  it('should show application as unpinned', () => {
    usePinBlockchainApplication.mockReturnValue({
      togglePin: mockTogglePin,
      pins: mockedPins,
      checkPinByChainId: jest.fn().mockReturnValue(false),
    });

    rerenderWithRouterAndQueryClient(BlockchainApplicationDetails, props);
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
    rerenderWithRouterAndQueryClient(BlockchainApplicationDetails, updatedProps);
    expect(screen.getByTestId('add-application-button')).toBeTruthy();
    fireEvent.click(screen.getByTestId('add-application-button'));
    expect(mockSetApplication).toHaveBeenCalledWith(aggregatedApplicationData);
  });
});
