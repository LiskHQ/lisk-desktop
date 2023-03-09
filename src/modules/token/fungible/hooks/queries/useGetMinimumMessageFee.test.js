import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { server } from 'src/service/mock/server';
import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useGetMinimumMessageFee } from './useGetMinimumMessageFee';

jest.useRealTimers();

beforeEach(() => jest.clearAllMocks());

describe('useGetMinimumMessageFee hook', () => {
  it('should return minimum messageFee hook', async () => {
    server.use(
      rest.post(`*/api/${API_VERSION}/invoke`, async (_, res, ctx) => {
        const response = {
          data: { fee: 1000 },
        };
        return res(ctx.json(response));
      })
    );
    const { result, waitFor } = renderHook(useGetMinimumMessageFee, { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual({ data: { fee: 1000 } });
  });
});
