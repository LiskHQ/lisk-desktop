import { rerenderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { fireEvent, screen } from '@testing-library/dom';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import useSettings from '@settings/hooks/useSettings';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import routes from 'src/routes/routes';
import SelectNetwork from './SelectNetwork';
import networks, { networkKeys } from '../../configuration/networks';
import { mockNetworkStatus } from '../../__fixtures__';
import { useNetworkStatus } from '../../hooks/queries';

const mockSetCurrentApplication = jest.fn();
const mockSetApplication = jest.fn();
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
    setValue: mockSetSettingValue,
  });
  useApplicationManagement.mockReturnValue({
    setApplications: mockSetApplication,
  });
  useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetCurrentApplication]);
  useNetworkStatus.mockReturnValue({
    data: mockNetworkStatus,
    isLoading: false,
    isError: false,
    isFetched: true,
  });
  useBlockchainApplicationMeta.mockReturnValue({
    data: mockBlockchainAppMeta,
    isLoading: false,
    isError: false,
  });

  it('should render details properly', () => {
    rerenderWithRouterAndQueryClient(SelectNetwork, props);
    expect(screen.getByText('Select network')).toBeTruthy();
    expect(screen.getAllByText(networks.devnet.label)[0]).toBeTruthy();
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

    Object.keys(networks)
      .filter((networkKey) => networks[networkKey].isAvailable)
      .forEach((networkKey) => {
        if (networks[networkKey] && networkKey !== networkKeys.devnet) {
          expect(screen.getByText(networks[networkKey].label)).toBeTruthy();
        }
      });
  });

  it('should trigger go to dashboard', () => {
    useNetworkStatus.mockReturnValue({
      data: mockNetworkStatus,
      isFetching: false,
      isSuccess: true,
    });
    useBlockchainApplicationMeta.mockReturnValue({
      data: mockBlockchainAppMeta,
      isFetching: false,
      isSuccess: true,
    });
    rerenderWithRouterAndQueryClient(SelectNetwork, props);

    fireEvent.click(screen.getByText('Continue to dashbord'));

    expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
  });

  it('should bot be possible to click "Continue to dashboard" button if !isSuccess or !isFetching', () => {
    useNetworkStatus.mockReturnValue({
      data: mockNetworkStatus,
      isFetching: true,
      isSuccess: false,
    });
    useBlockchainApplicationMeta.mockReturnValue({
      data: mockBlockchainAppMeta,
      isFetching: true,
      isSuccess: false,
    });
    rerenderWithRouterAndQueryClient(SelectNetwork, props);
    expect(screen.getByText('Continue to dashbord')).toHaveProperty('disabled', true);
  });
});
