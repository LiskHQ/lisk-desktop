import React from 'react';
import { waitFor } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { mockNetworkStatus } from '@network/__fixtures__';
import { useNetworkStatus } from '@network/hooks/queries';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__/mockBlockchainAppMeta';
import useSettings from '@settings/hooks/useSettings';
import networks from '@network/configuration/networks';
import { useValidServiceUrl } from '@blockchainApplication/manage/hooks/useValidServiceUrl';
import { smartRender } from 'src/utils/testHelpers';
import ApplicationBootstrap from './ApplicationBootstrap';

jest.mock('@network/hooks/queries/useNetworkStatus');
jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@settings/hooks/useSettings');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@blockchainApplication/manage/hooks/useValidServiceUrl');

const props = {
  children: <span>testing</span>,
};

const mockSetCurrentApplication = jest.fn();
const mockSetApplications = jest.fn();

const renderConfig = {
  renderType: 'mount',
  historyInfo: {
    push: jest.fn(),
    location: { search: '' },
  },
  queryClient: true,
};

describe('ApplicationBootstrap', () => {
  useSettings.mockReturnValue({
    customNetworks: [],
    mainChainNetwork: networks.devnet,
  });
  useCurrentApplication.mockReturnValue([mockManagedApplications[1], mockSetCurrentApplication]);
  useApplicationManagement.mockReturnValue({
    applications: mockManagedApplications,
    setApplications: mockSetApplications,
  });

  mockBlockchainAppMeta.data[0] = { ...mockBlockchainAppMeta.data[0], chainID: '04000000' };

  useBlockchainApplicationMeta.mockReturnValue({
    data: { data: mockBlockchainAppMeta.data },
    isLoading: false,
    isError: undefined,
  });

  useNetworkStatus.mockReturnValue({ data: mockNetworkStatus });
  useValidServiceUrl.mockReturnValue({validServiceUrl: mockBlockchainAppMeta.data[0].serviceURLs[0].http})

  it('Should set main chain application for the selected network', async () => {
    smartRender(ApplicationBootstrap, props, renderConfig);

    await waitFor(() => {
      expect(mockSetApplications).toHaveBeenCalledWith([mockBlockchainAppMeta.data[0]]);
      expect(mockSetCurrentApplication).toHaveBeenCalledWith(mockBlockchainAppMeta.data[0]);
    });
  });
});
