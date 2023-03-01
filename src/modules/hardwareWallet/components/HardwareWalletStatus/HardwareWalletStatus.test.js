import React from 'react';
import { screen, render } from '@testing-library/react';
import { mockHWCurrentDevice } from '@hardwareWallet/__fixtures__';
import { HardwareWalletStatus } from './HardwareWalletStatus';

jest.mock('@hardwareWallet/hooks/useHWStatus', () => ({
  useHWStatus: jest.fn(() => mockHWCurrentDevice),
}));

describe('hardwareWallet', () => {
  beforeEach(() => {
    render(<HardwareWalletStatus />);
  });

  it('should render hardware wallet icon', () => {
    const {model, status, manufacturer} = mockHWCurrentDevice
    expect(screen.getByAltText('hardwareWalletIcon')).toBeTruthy();
    expect(screen.getByText(model)).toBeTruthy();
    expect(screen.getByText(manufacturer)).toBeTruthy();
    expect(screen.getByText(status)).toBeTruthy();
  });
});
