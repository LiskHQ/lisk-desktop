import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';
import { validateAppNode } from '../utils';
import { useSearchApplications } from './useSearchApplications';

jest.mock('../utils/validateAppNode');

describe('useSearchApplications', () => {
  let hookImport = null;
  beforeEach(() => {
    hookImport = renderHook(() => useSearchApplications());
  });

  it('returns status ok on successful URL search and node responds successfully', async () => {
    const { result } = hookImport;
    const { onSearchApplications } = result.current;
    const searchTerm = 'http://api.coinbase.com';
    validateAppNode.mockResolvedValue({ status: 'ok' });
    act(() => {
      onSearchApplications(searchTerm);
    });
    await waitFor(() => {
      expect(result.current.isUrl).toEqual(true);
      expect(result.current.urlStatus).toEqual('ok');
    });
  });

  it('returns status error on URL search and node responds with failure', async () => {
    const { result } = hookImport;
    const { onSearchApplications } = result.current;
    const searchTerm = 'http://api.coinbase.com';
    validateAppNode.mockRejectedValue({ status: 'error' });
    act(() => {
      onSearchApplications(searchTerm);
    });
    await waitFor(() => {
      expect(result.current.isUrl).toEqual(true);
      expect(result.current.urlStatus).toEqual('error');
    });
  });

  it('returns URL status as false on name search', async () => {
    const { result } = hookImport;
    const { onSearchApplications } = result.current;
    const searchTerm = 'test app';
    act(() => {
      onSearchApplications(searchTerm);
    });
    await waitFor(() => {
      expect(result.current.isURL).toEqual(false);
    });
  });
});
