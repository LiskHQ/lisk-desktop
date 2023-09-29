import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import useSettings from '@settings/hooks/useSettings';
import { applicationsMap } from '@tests/fixtures/blockchainApplicationsManage';

import networks from '@network/configuration/networks';
import { deleteNetworksInApplications } from '@blockchainApplication/manage/store/action';
import { useReduxStateModifier } from './useReduxStateModifier';

jest.mock('@settings/hooks/useSettings');

jest.useRealTimers();

const mockState = {
  blockChainApplications: {
    applications: { devnet: applicationsMap, toBeRemoved: applicationsMap },
  },
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

const mockSetValueToSettings = jest.fn();

useSettings.mockReturnValue({
  customNetworks: [
    {
      name: 'custom_network_one',
      label: 'custom_network_one',
      serviceUrl: 'http://custom-network-service.com',
      wsServiceUrl: 'http://custom-network-service.com',
      isAvailable: true,
    },
  ],
  mainChainNetwork: {
    ...networks.devnet,
    mainChainNetwork: networks.devnet,
  },
  setValue: mockSetValueToSettings,
});

describe('useReduxStateModifier hook', () => {
  it('Should remove circular mainChainNetwork', async () => {
    renderHook(() => useReduxStateModifier(), { wrapper });
    expect(mockSetValueToSettings).toHaveBeenCalledWith(networks.devnet);
  });

  it('Should remove dead application network domains', async () => {
    renderHook(() => useReduxStateModifier(), { wrapper });
    expect(mockDispatch).toHaveBeenCalledWith(deleteNetworksInApplications(['toBeRemoved']));
  });
});
