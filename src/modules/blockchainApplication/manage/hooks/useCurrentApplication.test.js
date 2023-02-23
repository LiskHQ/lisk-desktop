import { renderHook, act } from '@testing-library/react-hooks';
import mockApplications from '@tests/fixtures/blockchainApplicationsManage';
import client from 'src/utils/api/client';
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
