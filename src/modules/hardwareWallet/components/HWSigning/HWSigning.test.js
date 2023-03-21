import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import HWSigning from './HWSigning';

describe('HWReconnect', () => {
  it('displays properly', () => {
    renderWithRouter(HWSigning);
    expect(screen.getByText('Confirm your transaction')).toBeInTheDocument();
  });
});
