import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { renderWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { MemoryRouter } from 'react-router';
import BlockchainApplicationRow from '.';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));

describe('BlockchainApplicationRow', () => {
  let wrapper;
  const props = {
    data: mockBlockchainApplications[0],
    togglePin: jest.fn(),
    t: jest.fn((val) => val),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = renderWithRouter(BlockchainApplicationRow, props);
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

  it('should navigate to the application\'s details', () => {
    const {
      chainID,
    } = mockBlockchainApplications[0];
    fireEvent.click(screen.getByText(chainID));

    expect(addSearchParamsToUrl).toHaveBeenCalledWith(expect.any(Object), { modal: 'blockChainApplicationDetails', chainId: chainID });
  });

  it('should invote toggle callback', () => {
    const { chainID } = mockBlockchainApplications[0];
    fireEvent.click(screen.getByTestId('pin-button'));
    expect(props.togglePin).toHaveBeenCalledWith(chainID);
  });

  it('should render the inactive pin icon', () => {
    expect(screen.getByAltText('unpinnedIcon')).toBeTruthy();
  });

  it('should render the active pin icon', () => {
    props.data.isPinned = true;

    wrapper.rerender(<MemoryRouter
      initialEntries={[]}
    >
      <BlockchainApplicationRow {...props} />
    </MemoryRouter>);

    expect(screen.getByAltText('pinnedIcon')).toBeTruthy();
  });
});
