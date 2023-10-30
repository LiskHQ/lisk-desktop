import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import mockApplications from '@tests/fixtures/blockchainApplicationsManage';
import client from 'src/utils/api/client';
import { removeThenAppendSearchParamsToUrl } from 'src/utils/searchParams';
import actionTypes from '../store/actionTypes';
import { useCurrentApplication } from './useCurrentApplication';

jest.mock('src/utils/api/client');
jest.mock('src/utils/searchParams');

const mockDispatch = jest.fn();
const mockState = {
  blockChainApplications: {
    current: mockApplications[0],
  },
  staking: {
    lskngtn9t6k4pg4foetmy493x96hraoq2krtcz4zy: {
      unconfirmed: 2000000000,
      confirmed: 0,
      name: 'genesis_73',
      commission: 10000,
    },
  },
};
const mockHistory = {
  location: {
    pathname: '',
  },
  push: jest.fn(),
};
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn().mockReturnValue(mockHistory),
}));

describe('useCurrentApplication hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('setApplication should not trigger on mounting', async () => {
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  it('should return correct current application', async () => {
    const { result } = renderHook(() => useCurrentApplication());
    const [currentApplication] = result.current;
    expect(currentApplication).toEqual(mockApplications[0]);
  });

  it("should return empty object if there's no current application", async () => {
    useSelector.mockImplementation((fn) =>
      fn({
        ...mockState,
        blockChainApplications: {},
      })
    );
    const { result } = renderHook(() => useCurrentApplication());
    const [currentApplication] = result.current;
    expect(currentApplication).toEqual({});
  });

  it('should open confirmation dialog if pending stakes exists', () => {
    const { result } = renderHook(() => useCurrentApplication());
    const [, setCurrentApplication] = result.current;
    act(() => {
      setCurrentApplication(mockApplications[0]);
    });
    expect(removeThenAppendSearchParamsToUrl).toHaveBeenCalledTimes(1);
    expect(removeThenAppendSearchParamsToUrl.mock.calls[0]).toEqual(
      expect.arrayContaining([{ modal: 'confirmationDialog' }])
    );
  });

  it('setCurrentApplication should dispatch an action', () => {
    const mockUpdatedState = { ...mockState };
    delete mockUpdatedState.staking;
    useSelector.mockImplementation((fn) => fn({ ...mockUpdatedState, staking: {} }));
    const { result } = renderHook(() => useCurrentApplication());
    const [, setCurrentApplication] = result.current;
    const expectedAction = {
      type: actionTypes.setCurrentApplication,
      app: mockApplications[0],
    };
    act(() => {
      setCurrentApplication(mockApplications[0]);
    });
    expect(client.create).toHaveBeenCalledWith({
      ws: expect.stringMatching('ws'),
      rest: expect.stringMatching('http'),
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
