import { renderHook } from '@testing-library/react-hooks';
import { mockTokensAccountExists } from '@token/fungible/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useTokenAccountExists } from './useTokenAccountExists';

jest.useRealTimers();

describe('useTokenAccountExists hook', () => {
  const config = {
    params: {
      publicKey: '6e0291140a28148267e30ac69b5e6965680190dc7de13b0a859bda556c9f0f86',
      tokenID: '0400000000000000',
    },
  };
  let hookResult;

  beforeEach(() => {
    hookResult = renderHook(() => useTokenAccountExists({ config }), { wrapper });
  });

  it('fetches data correctly', async () => {
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockTokensAccountExists);
  });
});
