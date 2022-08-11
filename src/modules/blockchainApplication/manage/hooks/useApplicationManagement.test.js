import { renderHook, act } from '@testing-library/react-hooks';
import mockApplications, { applicationsMap } from '@tests/fixtures/blockchainApplicationsManage';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import actionTypes from '../store/actionTypes';
import { useApplicationManagement } from './useApplicationManagement';

const mockDispatch = jest.fn();
const mockState = {
  blockChainApplications: {
    applications: applicationsMap,
    pins: [],
  },
};
const mockCurrentApplication = mockApplications[3];
const mockSetApplication = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));
jest.mock('./useCurrentApplication', () => ({
  useCurrentApplication: jest.fn(() => (
    [mockCurrentApplication, mockSetApplication]
  )),
}));

describe('useApplicationManagement hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });
  const { result } = renderHook(() => useApplicationManagement());

  it('setApplication should dispatch an action', () => {
    const { setApplication } = result.current;
    const expectedAction = {
      type: actionTypes.addApplicationByChainId,
      application: mockApplications[3],
    };
    act(() => {
      setApplication(mockApplications[3]);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('setApplication should not dispatch an action while adding default application', () => {
    const { setApplication } = result.current;
    act(() => {
      setApplication(mockApplications[2]);
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('getApplicationByChainId should return an application if chainId exists', () => {
    const { getApplicationByChainId } = result.current;
    const updatedApplication = { ...mockApplications[4], isPinned: false };
    expect(getApplicationByChainId(mockApplications[4].chainID)).toEqual(updatedApplication);
  });

  it('getApplicationByChainId should return undefined if chainId does not exist', () => {
    const { getApplicationByChainId } = result.current;
    expect(getApplicationByChainId('aq25derd17a4syc8aet4abcd')).toBeUndefined();
  });

  it('deleteApplicationByChainId should dispatch an action', () => {
    const { deleteApplicationByChainId } = result.current;
    const expectedAction = {
      type: actionTypes.deleteApplicationByChainId,
      chainId: mockApplications[4].chainID,
    };
    act(() => {
      deleteApplicationByChainId(mockApplications[4].chainID);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('deleteApplicationByChainId should dispatch an action and set application to Lisk if current application is being deleted', async () => {
    const { deleteApplicationByChainId } = result.current;
    const expectedAction = {
      type: actionTypes.deleteApplicationByChainId,
      chainId: mockCurrentApplication.chainID,
    };
    act(() => {
      deleteApplicationByChainId(mockCurrentApplication.chainID);
    });
    await flushPromises();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    expect(mockSetApplication).toHaveBeenCalledTimes(1);
    expect(mockSetApplication).toHaveBeenCalledWith(mockApplications[0]);
  });
});
