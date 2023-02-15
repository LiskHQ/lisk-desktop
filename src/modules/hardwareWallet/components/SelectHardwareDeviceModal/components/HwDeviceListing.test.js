import React from 'react';
import { screen, render } from '@testing-library/react';
import HwDeviceListing from './HwDeviceListing';

const hardwareDevices = [
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
    hardwareDevices,
  },
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn(mockSelector)),
}));

describe('HwDeviceListing', () => {
  it('Should render properly', () => {
    render(<HwDeviceListing />);
    hardwareDevices.forEach((hwDevice) => {
      expect(screen.getByText(hwDevice.model)).toBeTruthy();
      expect(screen.getByText(hwDevice.deviceId)).toBeTruthy();
      expect(screen.getByText(hwDevice.model)).toBeTruthy();
    });
  });
});
