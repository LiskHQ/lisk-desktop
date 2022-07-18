import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks/useCurrentApplication';
import { renderWithRouter } from 'src/utils/testHelpers';
import { MemoryRouter } from 'react-router';
import ApplicationManagementRow from './ApplicationManagementRow';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');

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

describe('ApplicationManangementRow', () => {
  let wrapper;
  const props = {
    application: mockManagedApplications[0],
    history: {
      push: jest.fn(),
    },
    location: {
      pathname: '/',
      search: '',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = renderWithRouter(ApplicationManagementRow, props);
  });

  it('should display correctly', () => {
    const { name } = props.application;

    expect(screen.getByText(name)).toBeTruthy();
  });

  it('should invoke toggle pin callback', () => {
    const { chainID } = mockManagedApplications[0];

    fireEvent.click(screen.getByTestId('pin-button'));
    expect(mockTogglePin).toHaveBeenCalledWith(chainID);
  });

  it('should render the active pin icon', () => {
    expect(screen.getByAltText('pinnedIcon')).toBeTruthy();
  });

  it('should render the inactive pin icon', () => {
    usePinBlockchainApplication.mockReturnValue({
      togglePin: mockTogglePin,
      pins: mockedPins,
      checkPinByChainId: jest.fn().mockReturnValue(false),
    });

    wrapper.rerender(
      <MemoryRouter
        initialEntries={[]}
      >
        <ApplicationManagementRow {...props} />
      </MemoryRouter>,
    );
    expect(screen.getByAltText('unpinnedIcon')).toBeTruthy();
  });

  it('should not navigate to remove application flow for default applications', () => {
    const deleteButton = screen.getByAltText('remove').closest('button');
    expect(deleteButton).toHaveAttribute('disabled');
  });

  it('should navigate to remove application flow', () => {
    props.application.isDefault = false;
    wrapper.rerender(
      <MemoryRouter
        initialEntries={[]}
      >
        <ApplicationManagementRow {...props} />
      </MemoryRouter>,
    );

    const deleteButton = screen.getByAltText('remove').closest('button');
    expect(deleteButton).not.toHaveAttribute('disabled');

    fireEvent.click(deleteButton);

    expect(props.history.push).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/',
      search: `?modal=removeApplicationFlow&chainId=${props.application.chainID}`,
    }));
  });

  it('should toggle applciation as current application for a non terminated application', () => {
    fireEvent.click(screen.getByText(props.application.name));
    expect(mockSetApplication).toHaveBeenCalledWith(expect.objectContaining(props.application));
  });

  it('should not display the warning icon for a non-terminated application', () => {
    expect(screen.queryByAltText('cautionFilledIcon')).not.toBeTruthy();
  });

  it('should not toggle terminated application as a current application', () => {
    props.application.state = 'terminated';
    wrapper.rerender(
      <MemoryRouter
        initialEntries={[]}
      >
        <ApplicationManagementRow {...props} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(props.application.name));
    expect(mockSetApplication).not.toHaveBeenCalled();
  });

  it('should not show pin for a terminated application', () => {
    expect(screen.queryByAltText('unpinnedIcon')).not.toBeTruthy();
  });

  it('should display the warning icon for a terminated application', () => {
    expect(screen.queryByAltText('cautionFilledIcon')).toBeTruthy();
  });

  it('should invoke the remove application flow for a terminated non default application', () => {
    props.application.state = 'terminated';
    props.application.isDefault = false;

    wrapper.rerender(
      <MemoryRouter initialEntries={[]}>
        <ApplicationManagementRow {...props} />
      </MemoryRouter>,
    );

    const deleteButton = screen.getByAltText('remove').closest('button');
    expect(deleteButton).not.toHaveAttribute('disabled');

    fireEvent.click(deleteButton);

    expect(props.history.push).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/',
      search: `?modal=removeApplicationFlow&chainId=${props.application.chainID}`,
    }));
  });

  it('should render the check mark for current application', () => {
    props.application = mockManagedApplications[1];
    props.application.isDefault = false;

    wrapper.rerender(
      <MemoryRouter
        initialEntries={[]}
      >
        <ApplicationManagementRow {...props} />
      </MemoryRouter>,
    );
    expect(screen.getByAltText('okIcon')).toBeTruthy();
  });
});
