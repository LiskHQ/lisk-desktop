import { fireEvent, screen } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { renderWithRouter } from 'src/utils/testHelpers';
import ApplicationManagementDropDown from './ApplicationManagementDropDown';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';

jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');

const mockSetApplication = jest.fn();
const mockCurrentApplication = mockManagedApplications[1];

useCurrentApplication.mockReturnValue([
  mockCurrentApplication,
  mockSetApplication,
]);

describe('ApplicationManagementDropDown', () => {
  const props = {
    location: {
      pathname: '/',
    },
    history: {
      push: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(ApplicationManagementDropDown, props);
  });

  it('should display properly', () => {
    expect(screen.getByText(mockCurrentApplication.name)).toBeTruthy();
    expect(screen.queryByAltText('dropdownArrowIcon')).toBeTruthy();
  });

  it('should show the manage application list popup', () => {
    fireEvent.click(screen.getByText(mockCurrentApplication.name));
    expect(props.history.push).toHaveBeenCalledWith(expect.objectContaining(
      { pathname: props.location.pathname, search: '?modal=manageApplications' },
    ));
  });
});
