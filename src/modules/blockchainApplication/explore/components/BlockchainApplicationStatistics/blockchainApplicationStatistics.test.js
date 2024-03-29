import { screen } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import { useBlockchainApplicationStatistics } from '../../hooks/queries/useBlockchainApplicationStatistics';
import { mockBlockchainAppStatistics } from '../../__fixtures__/mockBlockchainAppStatistics';
import BlockchainApplicationStatistics from './index';

jest.mock('../../hooks/queries/useBlockchainApplicationStatistics');

describe('BlockchainApplicationStatistics', () => {
  const config = { queryClient: true };

  it('should render properly', () => {
    useBlockchainApplicationStatistics.mockReturnValue({ data: mockBlockchainAppStatistics });
    smartRender(BlockchainApplicationStatistics, null, config);

    expect(screen.getByText('Total supply')).toBeInTheDocument();
    expect(screen.getByText('Staked')).toBeInTheDocument();
    expect(screen.getByText('5,000,000 LSK')).toBeInTheDocument();
    expect(screen.getByText('300,000 LSK')).toBeInTheDocument();
  });

  it('should render default supply and staked details if data is unavailable', () => {
    useBlockchainApplicationStatistics.mockReturnValue({});
    smartRender(BlockchainApplicationStatistics, null, config);

    expect(screen.getByText('Total supply')).toBeInTheDocument();
    expect(screen.getByText('Staked')).toBeInTheDocument();
    expect(screen.getAllByText('0 LSK')).toHaveLength(2);
  });
});
