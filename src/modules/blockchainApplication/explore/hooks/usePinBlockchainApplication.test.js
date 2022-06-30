import { renderHook, act } from '@testing-library/react-hooks';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplications';
import actionTypes from '@blockchainApplication/explore/store/actionTypes';
import { usePinBlockchainApplication } from './usePinBlockchainApplication';
import { pinApplication } from '../store/action';

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

  it('setPin and deletePin Should not be triggered on mounting', async () => {
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  it('setPin should dispatch an action', async () => {
    const { setPin } = result.current;
    const chainId = mockBlockchainApplications[0].chainID;
    act(() => setPin(chainId));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      pinApplication(chainId),
    );
  });

  it('should return pins as an arrray', async () => {
    const { pins, setPin } = result.current;
    const chainId = mockBlockchainApplications[0].chainID;

    act(() => setPin(chainId));
    const expectPins = mockBlockchainApplications.map(({ chainID }) => chainID);
    expect(pins).toEqual(expect.arrayContaining(expectPins));
  });

  it('should flag chain as a pinned application', async () => {
    const { checkPinByChainId, setPin } = result.current;
    const chainId = mockBlockchainApplications[0].chainID;

    act(() => setPin(chainId));
    expect(checkPinByChainId(chainId)).toBeTruthy();
  });

  it('should not flag chain as a pinned application', async () => {
    mockState.blockChainApplications.pins = [];
    jest.mock('react-redux', () => ({
      useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
      useDispatch: () => mockDispatch,
    }));

    const {
      result:
        { current: { checkPinByChainId } },
    } = renderHook(() => usePinBlockchainApplication());

    const chainId = mockBlockchainApplications[0].chainID;
    expect(checkPinByChainId(chainId)).not.toBeTruthy();
  });

  it('deletePin should dispatch an action', async () => {
    const { deletePin } = result.current;
    const chainId = mockBlockchainApplications[0].chainID;
    const expectedAction = {
      type: actionTypes.removeApplicationPin,
      chainId,
    };

    act(() => deletePin(chainId));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
