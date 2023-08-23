import moment from 'moment';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { useApplicationManagement } from '@blockchainApplication/manage/hooks';
import { useBlockchainApplicationExplore } from '../../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from '../../hooks/queries/useBlockchainApplicationMeta';
import { mockBlockchainApp } from '../../../explore/__fixtures__';
import { mockBlockchainAppMeta } from '../../__fixtures__';
import RemoveApplicationDetails from '.';

const mockDeleteApplicationByChainId = jest.fn();
const mockRefetchOnChainData = jest.fn();
const mockRefetchOffChainData = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('../../../explore/hooks/queries/useBlockchainApplicationExplore');
jest.mock('../../../manage/hooks/queries/useBlockchainApplicationMeta');

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
    history: { push: jest.fn() },
    nextStep: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('should display error screen if there are API errors', () => {
    useBlockchainApplicationExplore.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetchOnChainData,
    });
    useBlockchainApplicationMeta.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetchOffChainData,
    });
    renderWithRouterAndQueryClient(RemoveApplicationDetails, props);
    expect(screen.getByText('Error loading application data')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Try again'));
    expect(mockRefetchOnChainData).toHaveBeenCalledTimes(1);
    expect(mockRefetchOffChainData).toHaveBeenCalledTimes(1);
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
