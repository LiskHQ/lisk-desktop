import { renderHook } from '@testing-library/react-hooks';
import { mockLegacy } from '@legacy/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useMarketPrices } from './useMarketPrices';

jest.useRealTimers();

describe('useMarketPrices hook', () => {
  const config = {};
  let hookResult;

  beforeEach(() => {
    hookResult = renderHook(() => useMarketPrices({ config }), { wrapper });
  });

  it.skip('fetches data correctly', async () => {
    const { result, waitFor } = hookResult;

    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockLegacy);
  });

  it.skip('returns error if service is unavailable', async () => {
    hookResult = renderHook(() => useMarketPrices({ config }), { wrapper });
    const { result, waitFor } = hookResult;

    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      error: true,
      message: 'Service is not ready yet',
    };

    expect(result.current.error).toEqual(expectedResponse);
  });
});
