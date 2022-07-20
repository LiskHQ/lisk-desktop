import { fireEvent, screen } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import useApplicationManagement from '@blockchainApplication/manage/hooks/useApplicationManagement';
import { renderWithRouter } from 'src/utils/testHelpers';
import ApplicationManagementList from './ApplicationManagementList';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';

jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('@blockchainApplication/manage/hooks/useApplicationManagement');

const mockTogglePin = jest.fn();
const mockSetApplication = jest.fn();
const mockedPins = [];

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

useCurrentApplication.mockReturnValue([
  mockManagedApplications[1],
  mockSetApplication,
]);

useApplicationManagement.mockReturnValue({
  applications: mockManagedApplications,
});

describe('ApplicationManagementList', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(ApplicationManagementList, props);
  });

  it('should display properly', () => {
    expect(screen.getByText('Applications')).toBeTruthy();
    expect(screen.getByText('Add application')).toBeTruthy();
    mockManagedApplications.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it('should navigate to the add blockchain appliation flow', () => {
    fireEvent.click(screen.getByText('Add application'));
    expect(props.history.push).toHaveBeenCalledWith('/dashboard');
  });
});
