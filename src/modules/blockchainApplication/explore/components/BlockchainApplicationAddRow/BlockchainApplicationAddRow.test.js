import { screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import BlockchainApplicationAddRow from './BlockchainApplicationAddRow';

const props = {
  data: {
    name: 'Sample app',
    depositedLsk: 50000000,
  },
};

describe('BlockchainApplicationAddRow', () => {
  it('renders properly', () => {
    renderWithRouter(BlockchainApplicationAddRow, props);

    expect(screen.getByText('Sample app')).toBeTruthy();
    expect(screen.getByText('0.5 LSK')).toBeTruthy();
  });
});
