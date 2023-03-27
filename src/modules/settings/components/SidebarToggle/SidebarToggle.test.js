import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useSettings from '@settings/hooks/useSettings';
import settingConstants from '@settings/const/settingConstants';
import SidebarToggle from './SidebarToggle';

const sideBarExpanded = settingConstants.keys.sideBarExpanded;

jest.mock('@settings/hooks/useSettings');

describe('SidebarToggle Component', () => {
  const mockToggleSetting = jest.fn();

  it('Should render correctly when sidebar is expanded', () => {
    useSettings.mockReturnValue({ [sideBarExpanded]: false, toggleSetting: mockToggleSetting });
    render(<SidebarToggle />);
    expect(screen.getByText('Expand sidebar')).toBeTruthy();
    expect(screen.getByAltText('arrowRight')).toBeTruthy();
  });

  it('Should render correctly when sidebar is not expanded', () => {
    useSettings.mockReturnValue({ [sideBarExpanded]: true, toggleSetting: mockToggleSetting });
    render(<SidebarToggle />);
    fireEvent.click(screen.getByTestId('Icon'));
    expect(screen.getByText('Collapse sidebar')).toBeTruthy();
    expect(screen.getByAltText('arrowLeft')).toBeTruthy();
    expect(mockToggleSetting).toHaveBeenCalledTimes(1);
  });
});
