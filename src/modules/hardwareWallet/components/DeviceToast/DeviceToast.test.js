import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import DeviceToast from './DeviceToast';

describe('DeviceToast', () => {
  it('Should render properly without DialogLink', () => {
    const props = {
      closeToast: jest.fn(),
      label: 'hello',
      showSelectHardwareDeviceModalLink: false,
    };
    render(<DeviceToast {...props} />);

    expect(screen.getByText(props.label)).toBeTruthy();
  });

  it('Should render properly with DialogLink', () => {
    const props = {
      closeToast: jest.fn(),
      label: 'hello',
      showSelectHardwareDeviceModalLink: true,
    };
    renderWithRouter(DeviceToast, props);

    expect(screen.getByText(props.label)).toBeTruthy();
    expect(screen.getByText('Select')).toBeTruthy();
  });

  it('Should call closeToast when close icon is clicked', () => {
    const props = {
      closeToast: jest.fn(),
      label: 'hello',
    };
    render(<DeviceToast {...props} />);

    fireEvent.click(screen.getByRole('button'));
    expect(props.closeToast).toHaveBeenCalled();
  });
});
