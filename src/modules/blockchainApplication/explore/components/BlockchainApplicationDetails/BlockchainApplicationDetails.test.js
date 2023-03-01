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
import { mockBlockchainApp } from '../../__fixtures__';
import { mockBlockchainAppMeta } from '../../../manage/__fixtures__';
import BlockchainApplicationDetails from './index';

const mockedPins = ['1111'];
const mockTogglePin = jest.fn();
const mockSetApplication = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('../../hooks/queries/useBlockchainApplicationExplore', () => ({
  useBlockchainApplicationExplore: jest.fn(() => ({
    data: { data: mockBlockchainApp.data },
    isLoading: false,
    error: undefined,
  })),
}));
jest.mock('../../../manage/hooks/queries/useBlockchainApplicationMeta', () => ({
  useBlockchainApplicationMeta: jest.fn(() => ({
    data: { data: mockBlockchainAppMeta.data },
    isLoading: false,
    error: undefined,
  })),
}));

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

  // @todo: Loading and error tests will be handled in #4539
  it('should display properly', () => {
    const { name, status, lastCertificateHeight, lastUpdated } = mockBlockchainApp.data[0];
    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(status)).toBeTruthy();
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
