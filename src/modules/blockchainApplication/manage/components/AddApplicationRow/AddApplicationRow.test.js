import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import AddApplicationRow from './AddApplicationRow';

const props = {
  data: {
    chainName: 'Sample app',
    depositedLsk: 50000000,
  },
};

describe('AddApplicationRow', () => {
  it('renders properly', () => {
    renderWithRouter(AddApplicationRow, props);

    expect(screen.getByText('Sample app')).toBeTruthy();
    expect(screen.getByText('0.5 LSK')).toBeTruthy();
  });
});
