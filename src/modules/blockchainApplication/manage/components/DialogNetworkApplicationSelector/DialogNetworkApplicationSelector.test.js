import { fireEvent, screen } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import {
  usePinBlockchainApplication,
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import useSettings from '@settings/hooks/useSettings';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import networks from '@network/configuration/networks';
import { DEFAULT_NETWORK } from 'src/const/config';
import DialogNetworkApplicationSelector from './DialogNetworkApplicationSelector';

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
jest.mock('@settings/hooks/useSettings');
jest.mock('src/utils/searchParams');

const mockTogglePin = jest.fn();
const mockSetApplication = jest.fn();
const mockedPins = [];

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useCurrentApplication.mockReturnValue([mockManagedApplications[1], mockSetApplication]);

useApplicationManagement.mockReturnValue({
  applications: mockManagedApplications,
});

useSettings.mockReturnValue({
  customNetworks: [],
  mainChainNetwork: networks[DEFAULT_NETWORK],
  setValue: jest.fn(),
});

describe('ModalNetworkApplicationSelector', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouterAndQueryClient(DialogNetworkApplicationSelector, props);
  });

  it('should display properly', () => {
    mockManagedApplications.forEach(({ chainName }) => {
      expect(screen.getByText(chainName)).toBeTruthy();
    });
  });

  it('should navigate to the add blockchain application flow', () => {
    fireEvent.click(screen.getByText('Add application'));
    expect(addSearchParamsToUrl).toHaveBeenCalled();
  });
});
