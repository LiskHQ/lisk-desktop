import { renderHook } from '@testing-library/react-hooks';
import { mockBlocks } from '@block/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useBlocks } from './useBlocks';

jest.useRealTimers();

describe('useBlocks hook', () => {
  const limit = 2;
  const config = { params: { limit: 2 } };
  const { result, waitFor } = renderHook(() => useBlocks({ config }), { wrapper });

  it('fetching data correctly', async () => {
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      data: mockBlocks.data.slice(0, limit),
      meta: {
        ...mockBlocks.meta,
        count: limit,
        offset: 0,
      },
    };
    expect(result.current.data).toEqual(expectedResponse);
  });
});
