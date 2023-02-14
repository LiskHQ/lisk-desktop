import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { mockRewardDefault } from '@reward/__fixtures__';
import * as useCustomQuerySpy from '@common/hooks/useCustomQuery';
import { useCustomQuery } from '@common/hooks';
import { useRewardHeight } from './useRewardHeight';

jest.useRealTimers();
jest.spyOn(useCustomQuerySpy, 'useCustomQuery');

describe('useRewardHeight hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useRewardHeight(), { wrapper });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockRewardDefault);
  });

  it('should call useCustomQuery with height params', async () => {
    const params = { height: 2 };
    renderHook(() => useRewardHeight({ config: { params } }), { wrapper });
    expect(useCustomQuery).toBeCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          params,
        }),
      })
    );
  });
});
