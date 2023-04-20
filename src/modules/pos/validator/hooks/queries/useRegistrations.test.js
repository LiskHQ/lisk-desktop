import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useRegistrations } from './useRegistrations';

jest.useRealTimers();

describe('useRegistrations', () => {
  it('should return the correct data', async () => {
    const { result, waitFor } = renderHook(() => useRegistrations(), { wrapper });

    await waitFor(() => result.current.isFetched);
    expect(result.current.data).toEqual({
      labels: ['1970-10', '1970-11'],
      values: [0, 30],
    });
  });
});
