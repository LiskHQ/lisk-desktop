import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import { renderWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { MemoryRouter } from 'react-router';
import BlockchainApplicationRow from '.';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
const mockTogglePin = jest.fn();
const mockedPins = [mockBlockchainApplications[0].chainID];

usePinBlockchainApplication.mockReturnValue({
  togglePin: mockTogglePin,
  pins: mockedPins,
  checkPinByChainId: jest.fn().mockReturnValue(true),
});

jest.mock('src/utils/searchParams', () => ({
  selectSearchParamValue: jest.fn(),
  addSearchParamsToUrl: jest.fn(),
}));

describe('BlockchainApplicationRow', () => {
  let wrapper;
  const props = {
    data: mockBlockchainApplications[0],
    t: jest.fn((val) => val),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = renderWithRouter(BlockchainApplicationRow, props);
  });

  it('should display correctly', () => {
    const {
      chainName, status, chainID,
    } = mockBlockchainApplications[0];

    expect(screen.getByText(chainName)).toBeTruthy();
    expect(screen.getByText(chainID)).toBeTruthy();
    expect(screen.getByText(status)).toBeTruthy();
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

  it('should invoke toggle callback', () => {
    const { chainID } = mockBlockchainApplications[0];
    fireEvent.click(screen.getByTestId('pin-button'));
    expect(mockTogglePin).toHaveBeenCalledWith(chainID);
  });

  it('should render the active pin icon', () => {
    expect(screen.getByAltText('pinnedIcon')).toBeTruthy();
  });

  it('should render the inactive pin icon', () => {
    usePinBlockchainApplication.mockReturnValue({
      togglePin: mockTogglePin,
      pins: [],
      checkPinByChainId: jest.fn().mockReturnValue(false),
    });

    wrapper.rerender(<MemoryRouter
      initialEntries={[]}
    >
      <BlockchainApplicationRow {...props} />
    </MemoryRouter>);

    expect(screen.getByAltText('unpinnedIcon')).toBeTruthy();
  });
});
