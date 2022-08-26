import { renderHook } from '@testing-library/react-hooks';
import { mockFees } from '@transaction/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useFees } from '.';

jest.useRealTimers();

describe('useFees hook', () => {
  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useFees(), { wrapper });
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockFees);
  });
});
