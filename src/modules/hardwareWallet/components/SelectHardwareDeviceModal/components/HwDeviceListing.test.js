import React from 'react';
import { screen, render } from '@testing-library/react';
import HwDeviceListing from './HwDeviceListing';

const devices = [
  {
    deviceId: '13123123',
    model: 'Ledger Nano S',
  },
  {
    deviceId: '44523123',
    model: 'Ledger Nano X',
  },
];

const mockSelector = {
  hardwareWallet: {
    devices,
    currentDevice: {
      deviceId: '123',
    },
  },
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockSelector)),
  useDispatch: () => mockDispatch,
}));

describe('HwDeviceListing', () => {
  it('Should render properly', () => {
    render(<HwDeviceListing />);
    devices.forEach((hwDevice) => {
      expect(screen.getByText(hwDevice.model)).toBeTruthy();
      expect(screen.getByText(hwDevice.deviceId)).toBeTruthy();
      expect(screen.getByText(hwDevice.model)).toBeTruthy();
    });
  });
});
