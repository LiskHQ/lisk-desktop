import { rest } from 'msw';
import { renderHook } from '@testing-library/react-hooks';
import { API_VERSION } from 'src/const/config';
import { server } from 'src/service/mock/server';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useGetHasUserAccount } from './useGetHasUserAccount';

jest.useRealTimers();

beforeEach(() => jest.clearAllMocks());

describe('useGetHasUserAccount hook', () => {
  it('should return account initialization status', async () => {
    server.use(
      rest.post(`*/api/${API_VERSION}/invoke`, async (_, res, ctx) => {
        const response = {
          data: { exists: false },
        };
        return res(ctx.json(response));
      })
    );

    const { result, waitFor } = renderHook(() => useGetHasUserAccount(), { wrapper });
    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual({
      data: { exists: false },
    });
  });
});
