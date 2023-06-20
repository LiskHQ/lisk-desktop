import { rest } from 'msw';
import { renderHook } from '@testing-library/react-hooks';
import { queryClient, queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { mockTransactions } from '@transaction/__fixtures__';
import { usePosConstants } from '@pos/validator/hooks/queries';
import { mockPosConstants } from '@pos/validator/__fixtures__/mockPosConstants';
import { server } from 'src/service/mock/server';
import { API_VERSION } from 'src/const/config';
import { useCommissionChangeDate } from './useCommissionChangeDate';

jest.useRealTimers();

jest.mock('@pos/validator/hooks/queries');
usePosConstants.mockReturnValue({ data: mockPosConstants });

describe('useCommissionChangeDate hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.resetQueries();
    server.resetHandlers();
  });

  it('should not return a date if commission never has been changed', async () => {
    server.use(
      rest.get(`*/api/${API_VERSION}/transactions`, async (req, res, ctx) => {
        const response = {
          data: [],
        };
        return res(ctx.json(response));
      })
    );
    const { result, waitFor } = renderHook(() => useCommissionChangeDate(), { wrapper });
    await waitFor(() => !result.current.isLoading);
    expect(result.current.date).toBeFalsy();
  });

  it('should return a date if commission never has been changed', async () => {
    server.use(
      rest.get(`*/api/${API_VERSION}/transactions`, async (req, res, ctx) => {
        const transaction = {
          ...mockTransactions.data[0],
          moduleCommand: MODULE_COMMANDS_NAME_MAP.changeCommission,
          timeStamp: 123455,
        };
        const response = {
          data: [transaction],
        };
        return res(ctx.json(response));
      })
    );
    const { result, waitFor } = renderHook(() => useCommissionChangeDate(), { wrapper });
    await waitFor(() => !result.current.isLoading);
    expect(result.current.date).toBeTruthy();
  });
});
