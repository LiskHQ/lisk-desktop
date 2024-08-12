import { screen } from '@testing-library/dom';
import useSettings from '@settings/hooks/useSettings';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { rerenderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import NetworkSwitcherDropdown from '@network/components/networkSwitcherDropdown/NetworkSwitcherDropdown';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { mockNetworkStatus } from '../../__fixtures__';
import { useNetworkStatus } from '../../hooks/queries';

const mockSetSettingValue = jest.fn();

jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@settings/hooks/useSettings');
jest.mock('../../hooks/queries/useNetworkStatus');

describe('NetworkSwitcherDropdown', () => {
  const props = {
    history: { push: jest.fn() },
  };

  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    customNetworks: [],
    toggleSetting: mockSetSettingValue,
  });
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
  useCurrentApplication.mockReturnValue([mockBlockchainAppMeta.data[0], jest.fn()]);
  useApplicationManagement.mockReturnValue({
    networkApplications: [
      {
        devnet: {
          '04000000': mockBlockchainAppMeta.data[0],
        },
      },
    ],
  });

  it('should render properly', () => {
    rerenderWithRouterAndQueryClient(NetworkSwitcherDropdown, props);
    expect(screen.getByText('Switch network')).toBeTruthy();
  });
});
