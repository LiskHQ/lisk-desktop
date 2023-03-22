import { screen } from '@testing-library/react';
import { mockHWCurrentDevice } from '@hardwareWallet/__fixtures__';
import { renderWithRouter } from 'src/utils/testHelpers';
import { HardwareWalletStatus } from './HardwareWalletStatus';

const mockSelector = {
  hardwareWallet: {
    currentDevice: mockHWCurrentDevice,
  },
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockSelector)),
}));

describe('hardwareWallet', () => {
  beforeEach(() => {
    renderWithRouter(HardwareWalletStatus);
  });

  it('should render hardware wallet icon', () => {
    const { manufacturer, product } = mockHWCurrentDevice;
    expect(screen.getByText(manufacturer)).toBeTruthy();
    expect(screen.getByText(product)).toBeTruthy();
  });
});
