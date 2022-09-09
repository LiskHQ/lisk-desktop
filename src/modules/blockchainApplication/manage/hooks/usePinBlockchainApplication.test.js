import { renderHook, act } from '@testing-library/react-hooks';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { usePinBlockchainApplication } from './usePinBlockchainApplication';
import actionTypes from '../store/actionTypes';
import { toggleApplicationPin } from '../store/action';

const mockDispatch = jest.fn();
const mockState = {
  blockChainApplications: {
    pins: mockBlockchainApplications.map(({ chainID }) => chainID),
  },
};
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

describe('usePinBlockchainApplication hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });
  const { result } = renderHook(() => usePinBlockchainApplication());

  it('togglePin Should not be triggered on mounting', async () => {
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  it('togglePin should dispatch an action', async () => {
    const { togglePin } = result.current;
    const chainId = mockBlockchainApplications[0].chainID;
    act(() => togglePin(chainId));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(toggleApplicationPin(chainId));
  });

  it('should return pins as an array', async () => {
    const { pins, togglePin } = result.current;
    const chainId = mockBlockchainApplications[0].chainID;

    act(() => togglePin(chainId));
    const expectPins = mockBlockchainApplications.map(({ chainID }) => chainID);
    expect(pins).toEqual(expect.arrayContaining(expectPins));
  });

  it('should flag chain as a pinned application', async () => {
    const { checkPinByChainId, togglePin } = result.current;
    const chainId = mockBlockchainApplications[0].chainID;

    act(() => togglePin(chainId));
    expect(checkPinByChainId(chainId)).toBeTruthy();
  });

  it('should not flag chain as a pinned application', async () => {
    mockState.blockChainApplications.pins = [];
    jest.mock('react-redux', () => ({
      useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
      useDispatch: () => mockDispatch,
    }));

    const {
      result: {
        current: { checkPinByChainId },
      },
    } = renderHook(() => usePinBlockchainApplication());

    const chainId = mockBlockchainApplications[0].chainID;
    expect(checkPinByChainId(chainId)).not.toBeTruthy();
  });

  it('togglePin should dispatch an action', async () => {
    const { togglePin } = result.current;
    const chainId = mockBlockchainApplications[0].chainID;
    const expectedAction = {
      type: actionTypes.toggleApplicationPin,
      chainId,
    };

    act(() => togglePin(chainId));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
