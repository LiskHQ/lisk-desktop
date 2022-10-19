import { screen } from '@testing-library/react';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import { mockBlockchainAppStatistics } from '../../__fixtures__/mockBlockchainAppStatistics';
import BlockchainApplicationStatistics from './index';

jest.mock('../../hooks/queries/useBlockchainApplicationStatistics', () => ({
  useBlockchainApplicationStatistics: jest.fn(() => ({ data: mockBlockchainAppStatistics })),
}));

describe('BlockchainApplicationStatistics', () => {
  it('should render properly', () => {
    renderWithQueryClient(BlockchainApplicationStatistics);

    expect(screen.getByText('Total Supply')).toBeInTheDocument();
    expect(screen.getByText('Staked')).toBeInTheDocument();
    expect(screen.getByText('5,000,000 LSK')).toBeInTheDocument();
    expect(screen.getByText('3,000,000 LSK')).toBeInTheDocument();
  });
});
