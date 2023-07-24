import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
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
});
