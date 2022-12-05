import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useFilter } from '.';

describe('useFilter hook', () => {
  it('returns empty filter object', async () => {
    const { result } = renderHook(useFilter);

    await waitFor(() => {
      expect(result.current.filters).toEqual({});
    });
  });

  it('applies filter', async () => {
    const { result } = renderHook(useFilter);

    result.current.applyFilters({ key1: 'test1', key2: 'test2' });
    await waitFor(() => {
      expect(result.current.filters).toEqual({ key1: 'test1', key2: 'test2' });
    });

    result.current.applyFilters({ key1: 'test1', key2: '' });
    await waitFor(() => {
      expect(result.current.filters).toEqual({ key1: 'test1' });
    });
  });

  it('sets filter', async () => {
    const { result } = renderHook(useFilter);

    result.current.applyFilters({ key1: 'test1', key2: 'test2' });
    await waitFor(() => {
      expect(result.current.filters).toEqual({ key1: 'test1', key2: 'test2' });
    });

    result.current.setFilter('key1', 'test3');
    await waitFor(() => {
      expect(result.current.filters).toEqual({ key1: 'test3', key2: 'test2' });
    });

    result.current.setFilter('key1', '');
    await waitFor(() => {
      expect(result.current.filters).toEqual({ key2: 'test2' });
    });
  });

  it('clears filter', async () => {
    const { result } = renderHook(useFilter);

    result.current.applyFilters({ key1: 'test1', key2: 'test2' });
    await waitFor(() => {
      expect(result.current.filters).toEqual({ key1: 'test1', key2: 'test2' });
    });

    result.current.clearFilters();
    await waitFor(() => {
      expect(result.current.filters).toEqual({});
    });

    result.current.applyFilters({ key1: 'test1', key2: 'test2' });
    result.current.clearFilters(['key2']);
    await waitFor(() => {
      expect(result.current.filters).toEqual({ key1: 'test1' });
    });

    result.current.clearFilters(['key1']);
    await waitFor(() => {
      expect(result.current.filters).toEqual({});
    });
  });
});
