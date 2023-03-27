import { fireEvent, screen } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { renderWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ApplicationManagementDropDown from './ApplicationManagementDropDown';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';

jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('src/utils/searchParams');

const mockSetApplication = jest.fn();
const mockCurrentApplication = mockManagedApplications[1];

useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetApplication]);

describe('ApplicationManagementDropDown', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(ApplicationManagementDropDown, props);
  });

  it('should display properly', () => {
    expect(screen.getByText(mockCurrentApplication.chainName)).toBeTruthy();
    expect(screen.queryByAltText('dropdownArrowIcon')).toBeTruthy();
  });

  it('should show the manage application list popup', () => {
    fireEvent.click(screen.getByText(mockCurrentApplication.chainName));
    expect(addSearchParamsToUrl).toHaveBeenCalledWith(props.history, {
      modal: 'manageApplications',
    });
  });
});
