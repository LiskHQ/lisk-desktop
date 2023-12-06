import { fireEvent } from '@testing-library/react';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';
import { renderWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import BlockchainApplicationRow from '.';

jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
jest.mock('@blockchainApplication/manage/hooks/usePinBlockchainApplication');
const mockTogglePin = jest.fn();
const mockedPins = [mockBlockchainAppMeta.data[0].chainID];

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
  const blockChainData = {
    ...mockBlockchainAppMeta.data[0],
    status: 'activated',
    escrowedLSK: 10000000,
  };

  const props = {
    data: blockChainData,
    t: jest.fn((val) => val),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display correctly', () => {
    const { chainName, status, chainID } = blockChainData;
    wrapper = renderWithRouter(BlockchainApplicationRow, props);

    expect(wrapper.getByText(chainName)).toBeTruthy();
    expect(wrapper.getByText(chainID)).toBeTruthy();
    expect(wrapper.getByText(status)).toBeTruthy();
    expect(wrapper.getByText('0.1 LSK')).toBeTruthy();
  });

  it("should navigate to the application's details", () => {
    const { chainID } = blockChainData;
    wrapper = renderWithRouter(BlockchainApplicationRow, props);

    fireEvent.click(wrapper.getByText(chainID));

    expect(addSearchParamsToUrl).toHaveBeenCalledWith(expect.any(Object), {
      modal: 'blockChainApplicationDetails',
      chainId: chainID,
    });
  });

  it('should show a flashback message recommendation to regisgter a side chain', () => {
    const { chainID } = blockChainData;
    const mockAddMessage = jest.spyOn(FlashMessageHolder, 'addMessage').mockReturnValue({});

    wrapper = renderWithRouter(BlockchainApplicationRow, {
      ...props,
      data: { ...props.data, serviceURLs: undefined },
    });

    fireEvent.click(wrapper.getByText(chainID));

    expect(mockAddMessage).toHaveBeenCalledWith(expect.anything(), 'WarnMissingAppMetaData');
  });
});
