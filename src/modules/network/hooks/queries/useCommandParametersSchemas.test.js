import { renderHook } from '@testing-library/react-hooks';
import { mockLegacy } from '@legacy/__fixtures__';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useCommandParametersSchemas } from './useCommandParametersSchemas';

jest.useRealTimers();

describe('useCommandParametersSchemas hook', () => {
  const config = {};
  let hookResult;

  beforeEach(() => {
    hookResult = renderHook(() => useCommandParametersSchemas({ config }), { wrapper });
  });

  it.skip('fetches data correctly', async () => {
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.data).toEqual(mockLegacy);
  });

  it.skip('returns error if service is unavailable', async () => {
    hookResult = renderHook(() => useCommandParametersSchemas({ config }), { wrapper });
    const { result, waitFor } = hookResult;

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => result.current.isFetched);
    expect(result.current.isSuccess).toBeTruthy();
    const expectedResponse = {
      error: true,
      message: 'Service is not ready yet',
    };

    expect(result.current.error).toEqual(expectedResponse);
  });
});
