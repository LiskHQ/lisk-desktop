import { fireEvent, screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { renderWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import BlockchainApplicationRow from '.';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));

describe('BlockchainApplicationRow', () => {
  const props = {
    data: mockBlockchainApplications[0],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(BlockchainApplicationRow, props);
  });

  it('should display correctly', () => {
    const {
      name, state, chainID,
    } = mockBlockchainApplications[0];

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(chainID)).toBeTruthy();
    expect(screen.getByText(state)).toBeTruthy();
    expect(screen.getByText('0.5 LSK')).toBeTruthy();
  });

  it('should navigate to the application\'s details', () => {
    const {
      chainID,
    } = mockBlockchainApplications[0];
    fireEvent.click(screen.getByText(chainID));

    expect(addSearchParamsToUrl).toHaveBeenCalledWith(expect.any(Object), { modal: 'blockChainApplicationDetails', chainId: chainID });
  });
});
