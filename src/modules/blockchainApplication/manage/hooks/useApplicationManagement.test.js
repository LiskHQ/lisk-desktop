import { renderHook, act } from '@testing-library/react-hooks';
import mockApplications, { applicationsMap } from '@tests/fixtures/blockchainApplicationsManage';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import actionTypes from '../store/actionTypes';
import { useApplicationManagement } from './useApplicationManagement';
import { useCurrentApplication } from './useCurrentApplication';

jest.mock('./queries/useBlockchainApplicationMeta', () => ({
  useBlockchainApplicationMeta: jest.fn(() => ({
    data: { data: mockApplications },
  })),
}));

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
jest.mock('./useCurrentApplication');

describe('useApplicationManagement hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  useCurrentApplication.mockImplementation(() => [mockCurrentApplication, mockSetApplication]);

  const { result } = renderHook(() => useApplicationManagement(), { wrapper });

  it('setApplication should dispatch an action', () => {
    const { setApplication } = result.current;
    const expectedAction = {
      type: actionTypes.addApplicationByChainId,
      app: mockApplications[3],
    };
    act(() => {
      setApplication(mockApplications[3]);
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('setApplications should dispatch an action', () => {
    const { setApplications } = result.current;
    const expectedAction = {
      type: actionTypes.setApplications,
      apps: mockApplications,
    };
    act(() => {
      setApplications(mockApplications);
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

  it('deleteApplicationByChainId should not dispatch an action if application is default', async () => {
    jest.clearAllMocks();
    useCurrentApplication.mockImplementation(() => [mockApplications[1], mockSetApplication]);

    const {
      result: { current },
    } = renderHook(() => useApplicationManagement(), { wrapper });

    const { deleteApplicationByChainId } = current;
    act(() => {
      deleteApplicationByChainId(mockCurrentApplication.chainID);
    });
    await flushPromises();
    expect(mockDispatch).not.toHaveBeenCalledTimes(1);
    expect(mockSetApplication).not.toHaveBeenCalledTimes(1);
  });
});
