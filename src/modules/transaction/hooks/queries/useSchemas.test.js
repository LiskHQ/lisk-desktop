import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import actionTypes from '@network/store/actionTypes';
import { useSchemas } from './useSchemas';

jest.useRealTimers();

const mockState = {
  account: {
    list: [],
  },
  blockChainApplications: {
    current: {},
  },
  network: {
    name: 'testnet',
  },
  staking: {},
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

describe('useSchemas hook', () => {
  it('retrieves schemas', async () => {
    const { result, waitFor } = renderHook(() => useSchemas(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
  });

  it('dispatches the data to Redux store', async () => {
    const { result, waitFor } = renderHook(() => useSchemas(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: actionTypes.schemasRetrieved,
      data: result.current.data.data.commands,
    });
  });
});
