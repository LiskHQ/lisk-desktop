import { rerenderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { fireEvent, screen } from '@testing-library/dom';
import { useGetNetworksMainChainStatus } from '@blockchainApplication/manage/hooks/queries/useGetNetworksMainChainStatus';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { useGetMergedApplication } from '@blockchainApplication/manage/hooks/useGetMergedApplication';
import useSettings from '@settings/hooks/useSettings';
import routes from 'src/routes/routes';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import SelectNetwork from './NetworkSwitcherDropdown';
import networks, { networkKeys } from '../../configuration/networks';
import { mockNetworkStatus } from '../../__fixtures__';

const mockSetCurrentApplication = jest.fn();
const mockSetApplication = jest.fn();
const mockRefetchMergedApp = jest.fn();
const mockSetSettingValue = jest.fn();
const mockCurrentApplication = mockManagedApplications[0];

jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@settings/hooks/useSettings');
jest.mock('@blockchainApplication/manage/hooks/useGetMergedApplication');
jest.mock('@blockchainApplication/manage/hooks/queries/useGetNetworksMainChainStatus');

describe('SeletNetwork', () => {
  const props = {
    history: { push: jest.fn() },
  };
  const networksMainChainStatuses = Object.keys(networks).reduce(
    (result, networkKey) =>
      networkKey === networkKeys.customNode
        ? result
        : { ...result, [networkKey]: mockNetworkStatus },
    {}
  );

  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    toggleSetting: mockSetSettingValue,
  });
  useApplicationManagement.mockReturnValue({
    setApplications: mockSetApplication,
  });
  useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetCurrentApplication]);
  useGetNetworksMainChainStatus.mockReturnValue({
    data: networksMainChainStatuses,
    isLoading: false,
    isError: false,
    isFetched: true,
  });
  useGetMergedApplication.mockReturnValue({
    data: mockBlockchainAppMeta.data[0],
    isLoading: false,
    isError: false,
    refetch: mockRefetchMergedApp,
  });

  it('should render details properly', () => {
    rerenderWithRouterAndQueryClient(SelectNetwork, props);
    expect(screen.getByText('Select network')).toBeTruthy();
    expect(screen.getByText(networks.devnet.label)).toBeTruthy();
    expect(screen.getByText('Lisk')).toBeTruthy();
    expect(screen.getByText('Continue to dashbord')).toBeTruthy();
    expect(screen.getByText('Select network')).toBeTruthy();
    expect(screen.getByAltText('liskLogoWhiteNormalized')).toBeTruthy();
    expect(
      screen.getByText(
        '"Lisk" will be the default mainchain application, please select your preferred network for accessing the wallet. Once selected please click on "Continue to dashboard".'
      )
    ).toBeTruthy();

    fireEvent.click(screen.getByTestId('selected-menu-item'));

    Object.keys(networksMainChainStatuses).forEach((networkKey) => {
      if (networksMainChainStatuses[networkKey] && networkKey !== networkKeys.devnet) {
        expect(screen.getByText(networks[networkKey].label)).toBeTruthy();
      }
    });
  });

  it('should trigger go to dashboard', () => {
    rerenderWithRouterAndQueryClient(SelectNetwork, props);

    fireEvent.click(screen.getByText('Continue to dashbord'));

    expect(mockSetCurrentApplication).toHaveBeenCalledWith(mockBlockchainAppMeta.data[0]);
    expect(mockSetApplication).toHaveBeenCalledWith([mockBlockchainAppMeta.data[0]]);
    expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
  });

  it('should set default network on network settings', () => {
    useSettings.mockReturnValue({
      setValue: mockSetSettingValue,
    });
    rerenderWithRouterAndQueryClient(SelectNetwork, props);

    expect(mockSetCurrentApplication).toHaveBeenCalledWith(mockBlockchainAppMeta.data[0]);
    expect(mockSetApplication).toHaveBeenCalledWith([mockBlockchainAppMeta.data[0]]);
    expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
  });

  it('should prob main chain status when new network is selected', () => {
    rerenderWithRouterAndQueryClient(SelectNetwork, props);
    fireEvent.click(screen.getAllByText(networks[networkKeys.alphanet].label)[1]);

    expect(mockSetSettingValue).toHaveBeenCalledWith(networks[networkKeys.alphanet]);
  });

  it('should display an error if selected network is not available', () => {
    useGetMergedApplication.mockReturnValue({
      isLoading: false,
      isError: true,
      refetch: mockRefetchMergedApp,
    });

    rerenderWithRouterAndQueryClient(SelectNetwork, props);
    expect(screen.getByText('Failed to connect to network!')).toBeTruthy();
    expect(screen.getByText('Try Again')).toBeTruthy();

    fireEvent.click(screen.getByText('Try Again'));
    expect(mockRefetchMergedApp).toHaveBeenCalled();
  });

  it('should be in loading state when verifying selected network`s mainchain', () => {
    useGetNetworksMainChainStatus.mockReturnValue({
      data: {},
      isLoading: true,
      isError: false,
      isFetched: true,
    });
    useGetMergedApplication.mockReturnValue({
      isLoading: true,
      isError: false,
      refetch: mockRefetchMergedApp,
    });

    rerenderWithRouterAndQueryClient(SelectNetwork, props);

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('should only show networks that are available', () => {
    const { mainnet, alphanet, betanet, ...networkStatuses } = networksMainChainStatuses;

    useGetNetworksMainChainStatus.mockReturnValue({
      data: networkStatuses,
      isLoading: false,
      isError: false,
      isFetched: true,
    });

    rerenderWithRouterAndQueryClient(SelectNetwork, props);

    expect(screen.getByText(networks[networkKeys.testnet].label)).toBeTruthy();
    expect(screen.getByText(networks[networkKeys.devnet].label)).toBeTruthy();
    expect(screen.queryByText(networks[networkKeys.mainnet].label)).toBeFalsy();
    expect(screen.queryByText(networks[networkKeys.alphanet].label)).toBeFalsy();
    expect(screen.queryByText(networks[networkKeys.betanet].label)).toBeFalsy();
  });
});
