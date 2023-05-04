import { renderHook, act } from '@testing-library/react-hooks';
import mockApplications from '@tests/fixtures/blockchainApplicationsManage';
import client from 'src/utils/api/client';
import stakesActionTypes from '@pos/validator/store/actions/actionTypes';
import actionTypes from '../store/actionTypes';
import { useCurrentApplication } from './useCurrentApplication';

jest.mock('src/utils/api/client');
const mockDispatch = jest.fn();
const mockState = {
  blockChainApplications: {
    current: mockApplications[0],
  },
};
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

describe('useCurrentApplication hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });
  const { result } = renderHook(() => useCurrentApplication());
  it('setAccount Should not trigger on mounting', async () => {
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  it('should return correct current application', async () => {
    const [currentApplication] = result.current;
    expect(currentApplication).toEqual(mockApplications[0]);
  });

  it('setCurrentApplication should dispatch an action', async () => {
    const [, setCurrentApplication] = result.current;
    const expectedAction = {
      type: actionTypes.setCurrentApplication,
      app: mockApplications[0],
    };
    const expectedStakesResetAction = {
      type: stakesActionTypes.stakesReset,
    };
    act(() => {
      setCurrentApplication(mockApplications[0]);
    });
    expect(client.create).toHaveBeenCalledWith({
      ws: expect.stringMatching('ws'),
      rest: expect.stringMatching('http'),
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, expectedAction);
    expect(mockDispatch).toHaveBeenNthCalledWith(2, expectedStakesResetAction);
  });
});
