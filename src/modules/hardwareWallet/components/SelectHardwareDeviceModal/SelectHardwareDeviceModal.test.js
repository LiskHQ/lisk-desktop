import { screen } from '@testing-library/react';
import {renderWithRouter} from "src/utils/testHelpers";
import SelectHardwareDeviceModal from './SelectHardwareDeviceModal';

describe('SelectHardwareDeviceModal', () => {
  it('Should show Switch account in the title', () => {
    renderWithRouter(SelectHardwareDeviceModal);
    expect(screen.getByText('Switch account')).toBeTruthy();
  });
});
