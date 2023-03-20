import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { setCurrentHWDevice } from '@hardwareWallet/store/actions';
import HwDeviceItem from './HwDeviceItem';

const mockSelector = {
  hardwareWallet: {
    currentDevice: {
      path: '123',
    },
  },
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockSelector)),
  useDispatch: mockDispatch,
}));

jest.mock('@hardwareWallet/store/actions', () => ({
  setCurrentHWDevice: jest.fn(),
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
    expect(setCurrentHWDevice).toHaveBeenCalledWith(props.hwDevice.path);
  });
});
