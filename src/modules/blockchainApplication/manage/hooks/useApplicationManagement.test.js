import { renderHook, act } from '@testing-library/react-hooks';
import mockApplications, { applicationsMap } from '@tests/fixtures/blockchainApplicationsManage';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import actionTypes from '../store/actionTypes';
import useApplicationManagement from './useApplicationManagement';

const mockDispatch = jest.fn();
const mockState = {
  blockChainApplications: {
    applications: applicationsMap,
  },
};
const mockSetApplication = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));
jest.mock('./useCurrentApplication', () => ({
  useCurrentApplication: jest.fn(() => (
    [mockApplications[1], mockSetApplication]
  )),
}));

describe('useApplicationManagement hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });
  const { result } = renderHook(() => useApplicationManagement());

  it('setNewApplication should dispatch an action', () => {
    const { setNewApplication } = result.current;
    const expectedAction = {
      type: actionTypes.addApplicationByChainId,
      data: mockApplications[0],
    };
    act(() => {
      setNewApplication(mockApplications[0]);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('getApplicationByChainId should return an application if chainId exists', () => {
    const { getApplicationByChainId } = result.current;
    expect(getApplicationByChainId('aq25derd17a4syc8aet3pryt')).toEqual(mockApplications[2]);
  });

  it('getApplicationByChainId should return undefined if chainId does not exist', () => {
    const { getApplicationByChainId } = result.current;
    expect(getApplicationByChainId('aq25derd17a4syc8aet4abcd')).toBeUndefined();
  });

  it('deleteApplicationByChainId should dispatch an action', () => {
    const { deleteApplicationByChainId } = result.current;
    const expectedAction = {
      type: actionTypes.deleteApplicationByChainId,
      data: mockApplications[2].chainID,
    };
    act(() => {
      deleteApplicationByChainId(mockApplications[2].chainID);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('deleteApplicationByChainId should dispatch an action and set application to Lisk if current application is being deleted', async () => {
    const { deleteApplicationByChainId } = result.current;
    const expectedAction = {
      type: actionTypes.deleteApplicationByChainId,
      data: mockApplications[1].chainID,
    };
    act(() => {
      deleteApplicationByChainId(mockApplications[1].chainID);
    });
    await flushPromises();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    expect(mockSetApplication).toHaveBeenCalledTimes(1);
    expect(mockSetApplication).toHaveBeenCalledWith(mockApplications[0]);
  });
});
