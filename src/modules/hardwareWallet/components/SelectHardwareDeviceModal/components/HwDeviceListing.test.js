import React from 'react';
import { screen, render } from '@testing-library/react';
import HwDeviceListing from './HwDeviceListing';

const devices = [
  {
    path: '13123123',
    manufacturer: 'Ledger',
    product: 'Nano S',
  },
  {
    path: '44523123',
    manufacturer: 'Ledger',
    product: 'Nano X',
  },
];

const mockSelector = {
  hardwareWallet: {
    devices,
    currentDevice: {
      path: '123',
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
      expect(screen.getByText(`${hwDevice.manufacturer} ${hwDevice.product}`)).toBeTruthy();
    });
  });
});
