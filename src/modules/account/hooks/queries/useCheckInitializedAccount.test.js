import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { getCheckInitializedAccount } from '../../utils/getTokenBalances';
import useCheckInitializedAccount from './useCheckInitializedAccount';

jest.useRealTimers();
jest.mock('../../utils/getCheckInitializedAccount');

describe('useCheckInitializedAccount hook', () => {
  it('fetching data correctly', async () => {
    getCheckInitializedAccount.mockReturnValue(false);
    const { result, waitFor } = renderHook(() => useCheckInitializedAccount(), { wrapper });

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toBeFalsy();
  });
});
