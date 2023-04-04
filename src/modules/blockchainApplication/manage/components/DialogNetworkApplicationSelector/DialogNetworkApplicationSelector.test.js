import { fireEvent, screen } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import {
  usePinBlockchainApplication,
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { renderWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import DialogNetworkApplicationSelector from './DialogNetworkApplicationSelector';

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');
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

describe('ModalNetworkApplicationSelector', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(DialogNetworkApplicationSelector, props);
  });

  it('should display properly', () => {
    expect(screen.getByText('Applications')).toBeTruthy();
    expect(screen.getByText('Add application')).toBeTruthy();
    mockManagedApplications.forEach(({ chainName }) => {
      expect(screen.getByText(chainName)).toBeTruthy();
    });
  });

  it('should navigate to the add blockchain application flow', () => {
    fireEvent.click(screen.getByText('Add application'));
    expect(addSearchParamsToUrl).toHaveBeenCalledWith(props.history, {
      modal: 'addApplicationList',
    });
  });
});
