import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import HWConfirm from './HWConfirm';

describe('HWReconnect', () => {
  it('displays properly', () => {
    renderWithRouter(HWConfirm);
    expect(screen.getByText('Confirm your transaction')).toBeInTheDocument();
  });
});
