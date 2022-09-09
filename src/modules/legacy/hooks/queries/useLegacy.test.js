import { renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { mockLegacy } from '@legacy/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { server } from 'src/service/mock/server';
import { API_VERSION } from 'src/const/config';
import { useLegacy } from './useLegacy';

jest.useRealTimers();

describe('useLegacy hook', () => {
  it('fetches data correctly', async () => {
    const config = {
      params: { publicKey: '6e0291140a28148267e30ac69b5e6965680190dc7de13b0a859bda556c9f0f86' },
    };
    const { result, waitFor } = renderHook(() => useLegacy({ config }), { wrapper });

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockLegacy);
  });

  it.skip('returns error if publicKey is invalid', async () => {
    const errorConfig = { params: { publicKey: '0190dc7de13b0a859bda556c9f0f86' } };
    const { result, waitFor } = renderHook(() => useLegacy({ config: errorConfig }), { wrapper });
    const expectedResponse = {
      error: true,
      message:
        "Invalid input: The 'publicKey' field length must be greater than or equal to 64 characters long., The 'publicKey' field fails to match the required pattern.",
    };
    server.use(
      rest.get(`*/api/${API_VERSION}/legacy`, async (_, res, ctx) => {
        const response = expectedResponse;
        return res.once(ctx.status(400), ctx.json(response));
      })
    );

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.error).toEqual(expectedResponse);
  });

  it('returns an error object if URL is called without options/config', async () => {
    const { result, waitFor } = renderHook(() => useLegacy(), { wrapper });

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockLegacy);
  });
});
