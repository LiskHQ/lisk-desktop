import { renderHook } from '@testing-library/react-hooks';
import { mockLegacy } from '@legacy/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useLegacy } from './useLegacy';

jest.useRealTimers();

describe('useLegacy hook', () => {
  const config = { params: { publicKey: '6e0291140a28148267e30ac69b5e6965680190dc7de13b0a859bda556c9f0f86' } };
  let hookResult;

  beforeEach(() => {
    hookResult = renderHook(() => useLegacy({ config }), { wrapper });
  });

  it.skip('fetches data correctly', async () => {
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockLegacy);
  });

  it.skip('returns error if publicKey is invalid', async () => {
    const errorConfig = { params: { publicKey: '0190dc7de13b0a859bda556c9f0f86' } };
    hookResult = renderHook(() => useLegacy({ config: errorConfig }), { wrapper });
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      error: true,
      message: "Invalid input: The 'publicKey' field length must be greater than or equal to 64 characters long., The 'publicKey' field fails to match the required pattern.",
    };

    expect(result.current.error).toEqual(expectedResponse);
  });
});
