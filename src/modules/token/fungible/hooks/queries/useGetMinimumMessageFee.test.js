import { renderHook } from '@testing-library/react-hooks';
import { mockInvoke } from 'src/modules/common/__fixtures__/mockInvoke';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useGetMinimumMessageFee } from './useGetMinimumMessageFee';

jest.useRealTimers();

beforeEach(() => jest.clearAllMocks());

describe('useGetMinimumMessageFee hook', () => {
  it('should return minimum messageFee hook', async () => {
    const { result, waitFor } = renderHook(useGetMinimumMessageFee, { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockInvoke);
  });
});
