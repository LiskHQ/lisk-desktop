import { renderHook } from '@testing-library/react-hooks';
import { mockIndexStatus } from '@network/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import client from 'src/utils/api/client';
import { useIndexStatus } from '.';

jest.useRealTimers();

describe('useIndexStatus hook', () => {
  const mockClient = {
    ...client,
    socket: {
      on: jest.fn(),
      off: jest.fn(),
    },
  };

  it('fetching data correctly', async () => {
    const { result, waitFor } = renderHook(() => useIndexStatus({ client: mockClient }), {
      wrapper,
    });
    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockIndexStatus);
  });
});
