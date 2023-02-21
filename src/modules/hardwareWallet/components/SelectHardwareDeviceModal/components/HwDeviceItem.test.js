import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import hwManager from 'src/modules/hardwareWallet/manager/HWManager';
import HwDeviceItem from './HwDeviceItem';

const mockSelector = {
  hardwareWallet: {
    currentDevice: {
      deviceId: '123',
    },
  },
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn(mockSelector)),
}));

jest.mock('src/modules/hardwareWallet/manager/HWManager', () => ({
  selectDevice: jest.fn(),
}));

describe('HwDeviceItem', () => {
  it('Should render properly', () => {
    const props = {
      hwDevice: { deviceId: '333', model: 'Ledger Nano s' },
    };
    render(<HwDeviceItem {...props} />);
    expect(screen.getByText(props.hwDevice.model)).toBeTruthy();
    expect(screen.getByText(props.hwDevice.deviceId)).toBeTruthy();
    expect(screen.getByText(props.hwDevice.model)).toBeTruthy();
  });

  it('Should have check checkbox if deviceId === active device', () => {
    const props = {
      hwDevice: {
        deviceId: mockSelector.hardwareWallet.currentDevice.deviceId,
        model: 'Ledger Nano s',
      },
    };
    render(<HwDeviceItem {...props} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toEqual(true);
  });

  it('Should call hwManager.selectDevice with deviceId on checkbox click', () => {
    const props = {
      hwDevice: {
        deviceId: '333',
        model: 'Ledger Nano s',
      },
    };
    render(<HwDeviceItem {...props} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(hwManager.selectDevice).toHaveBeenCalledWith(props.hwDevice.deviceId);
  });
});
