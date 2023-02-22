import React from 'react';
import { screen, render } from '@testing-library/react';
import { HardwareWalletStatus } from './HardwareWalletStatus';

describe('hardwareWallet', () => {
  beforeEach(() => {
    render(<HardwareWalletStatus />);
  });

  // @TODO: we should update test when the useHWStatus hook has been integrated
  it('should render hardware wallet icon', () => {
    expect(screen.getByAltText('hardwareWalletIcon')).toBeTruthy();
    expect(screen.getByText('Brand :')).toBeTruthy();
    expect(screen.getByText('Model :')).toBeTruthy();
    expect(screen.getByText('ID :')).toBeTruthy();
    expect(screen.getByText('Status :')).toBeTruthy();
  });
});
