import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { waitFor } from '@testing-library/react';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useNetworkStatus } from '@network/hooks/queries';
import { useSearchApplications } from './useSearchApplications';

jest.mock('@network/hooks/queries');

describe('useSearchApplications', () => {
  let hookImport = null;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns status ok on successful URL search and node responds successfully', async () => {
    const searchTerm = 'http://api.coinbase.com';
    useNetworkStatus.mockReturnValue({ isLoading: false, isSuccess: true, isError: false });
    hookImport = renderHook(() => useSearchApplications(), { wrapper });
    const { result } = hookImport;
    const { onSearchApplications } = result.current;
    act(() => {
      onSearchApplications(searchTerm);
    });
    await waitFor(() => {
      expect(result.current.isUrl).toEqual(true);
      expect(result.current.urlStatus).toEqual('ok');
    });
  });

  it('returns status error on URL search and node responds with failure', async () => {
    const searchTerm = 'http://api.enevti.com';
    useNetworkStatus.mockReturnValue({ isLoading: false, isSuccess: false, isError: true });
    hookImport = renderHook(() => useSearchApplications(), { wrapper });
    const { result } = hookImport;
    const { onSearchApplications } = result.current;
    act(() => {
      onSearchApplications(searchTerm);
    });
    await waitFor(() => {
      expect(result.current.isUrl).toEqual(true);
      expect(result.current.urlStatus).toEqual('error');
    });
  });

  it('returns URL status as false on name search', async () => {
    const searchTerm = 'test app';
    useNetworkStatus.mockReturnValue({ isLoading: false, isSuccess: false, isError: false });
    hookImport = renderHook(() => useSearchApplications(), { wrapper });
    const { result } = hookImport;
    const { onSearchApplications } = result.current;
    act(() => {
      onSearchApplications(searchTerm);
    });
    await waitFor(() => {
      expect(result.current.isUrl).toEqual(false);
    });
  });
});
