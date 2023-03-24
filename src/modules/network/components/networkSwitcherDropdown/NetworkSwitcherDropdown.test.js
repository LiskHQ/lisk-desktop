import { rerenderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { fireEvent, screen } from '@testing-library/dom';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import useSettings from '@settings/hooks/useSettings';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import networks, { networkKeys } from '../../configuration/networks';
import { mockNetworkStatus } from '../../__fixtures__';
import { useNetworkStatus } from '../../hooks/queries';
import NetworkSwitcherDropdown from './NetworkSwitcherDropdown';

const mockSetCurrentApplication = jest.fn();
const mockSetApplication = jest.fn();
const mockRefetchMergedApp = jest.fn();
const mockSetSettingValue = jest.fn();
const mockCurrentApplication = mockManagedApplications[0];

jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@settings/hooks/useSettings');
jest.mock('../../hooks/queries/useNetworkStatus');
jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');

describe('SeletNetwork', () => {
  const props = {
    history: { push: jest.fn() },
  };

  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    toggleSetting: mockSetSettingValue,
  });
  useApplicationManagement.mockReturnValue({
    setApplications: mockSetApplication,
  });
  useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetCurrentApplication]);
  useNetworkStatus.mockReturnValue({
    data: {
      ...mockNetworkStatus,
      data: { ...mockNetworkStatus.data, chainID: mockBlockchainAppMeta.data[0].chainID },
    },
    isLoading: false,
    isError: false,
    isFetched: true,
    refetch: jest.fn(),
  });
  useBlockchainApplicationMeta.mockReturnValue({
    data: mockBlockchainAppMeta,
    isLoading: false,
    isError: false,
    refetch: mockRefetchMergedApp,
  });

  it('should set default network on network settings', () => {
    useSettings.mockReturnValue({
      setValue: mockSetSettingValue,
    });
    rerenderWithRouterAndQueryClient(NetworkSwitcherDropdown, props);

    expect(mockSetCurrentApplication).toHaveBeenCalledWith(mockBlockchainAppMeta.data[0]);
    expect(mockSetApplication).toHaveBeenCalledWith(mockBlockchainAppMeta.data);
  });

  it('should display an error if selected network is not available', () => {
    useBlockchainApplicationMeta.mockReturnValue({
      isLoading: false,
      isError: true,
      refetch: mockRefetchMergedApp,
    });

    rerenderWithRouterAndQueryClient(NetworkSwitcherDropdown, props);
    expect(screen.getByText('Failed to connect to network!')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();

    fireEvent.click(screen.getByText('Try again'));
    expect(mockRefetchMergedApp).toHaveBeenCalled();
  });

  it('should be in loading state when verifying selected network`s mainchain', () => {
    useBlockchainApplicationMeta.mockReturnValue({
      data: {},
      isLoading: true,
      isError: false,
      isFetched: true,
    });
    useBlockchainApplicationMeta.mockReturnValue({
      isLoading: true,
      isError: false,
      refetch: mockRefetchMergedApp,
    });

    rerenderWithRouterAndQueryClient(NetworkSwitcherDropdown, props);

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('should only show networks that are available', () => {
    rerenderWithRouterAndQueryClient(NetworkSwitcherDropdown, props);

    Object.keys(networks)
      .filter((networkKey) => networks[networkKey].isAvailable)
      .forEach((networkKey) => {
        if (networks[networkKey] && networkKey !== networkKeys.devnet) {
          expect(screen.getByText(networks[networkKey].label)).toBeTruthy();
        }
      });
  });
});
