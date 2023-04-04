import moment from 'moment';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import {
  usePinBlockchainApplication,
  useApplicationManagement,
} from '@blockchainApplication/manage/hooks';
import { useBlockchainApplicationExplore } from '../../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from '../../hooks/queries/useBlockchainApplicationMeta';
import { mockBlockchainApp } from '../../../explore/__fixtures__';
import { mockBlockchainAppMeta } from '../../__fixtures__';
import RemoveApplicationDetails from '.';

const mockedPins = ['1111'];
const mockTogglePin = jest.fn();
const mockDeleteApplicationByChainId = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('../../../explore/hooks/queries/useBlockchainApplicationExplore');
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
  deleteApplicationByChainId: mockDeleteApplicationByChainId,
});
const aggregatedApplicationData = {
  ...mockBlockchainApp.data[0],
  ...mockBlockchainAppMeta.data[0],
};

describe('BlockchainApplicationDetails', () => {
  const props = {
    location: {
      search: 'chainId=00000001',
    },
    nextStep: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouterAndQueryClient(RemoveApplicationDetails, props);
  });

  it('should display properly', () => {
    const { name, address, status, lastCertificateHeight, lastUpdated } = mockBlockchainApp.data[0];

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(address)).toBeTruthy();
    expect(screen.getByText(status)).toBeTruthy();
    expect(screen.getByText(lastCertificateHeight)).toBeTruthy();
    expect(screen.getByText(moment(lastUpdated * 1000).format('DD MMM YYYY'))).toBeTruthy();

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
    expect(mockTogglePin).toHaveBeenCalledWith('00000001');
  });

  it('should show application as unpinned', () => {
    usePinBlockchainApplication.mockReturnValue({
      togglePin: mockTogglePin,
      pins: mockedPins,
      checkPinByChainId: jest.fn().mockReturnValue(false),
    });

    renderWithRouterAndQueryClient(RemoveApplicationDetails, props);
    expect(screen.getByAltText('unpinnedIcon')).toBeTruthy();
  });

  it('should invoke the cancel callback', () => {
    fireEvent.click(screen.getByText('Cancel'));
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('should remove blockchain application', () => {
    fireEvent.click(screen.getByText('Remove application now'));
    expect(props.nextStep).toHaveBeenCalledWith(
      expect.objectContaining({ application: aggregatedApplicationData })
    );
  });
});
