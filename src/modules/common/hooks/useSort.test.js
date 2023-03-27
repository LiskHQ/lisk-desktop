import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useSort } from '.';

describe('useSort hook', () => {
  const data = [
    {
      prop1: 'test3',
      prop2: 3,
    },
    {
      prop1: 'test1',
      prop2: 1,
    },
    {
      prop1: 'test2',
      prop2: 2,
    },
  ];

  it('sorts list by the default sort order', async () => {
    const { result } = renderHook(() => useSort({ defaultSort: 'prop2:desc', data }));

    await waitFor(() => {
      expect(result.current.sort).toEqual('prop2:desc');
      expect(result.current.sortedData).toEqual(data.sort((a, b) => (b.prop2 > a.prop2 ? 1 : -1)));
    });

    const { result: result2 } = renderHook(() => useSort({ defaultSort: 'prop1:desc', data }));

    await waitFor(() => {
      expect(result2.current.sort).toEqual('prop1:desc');
      expect(result2.current.sortedData).toEqual(data.sort((a, b) => (b.prop1 > a.prop1 ? 1 : -1)));
    });
  });

  it('should not sort data if there is no sort', async () => {
    const { result } = renderHook(() => useSort({ data }));

    await waitFor(() => {
      expect(result.current.sort).toEqual(undefined);
      expect(result.current.sortedData).toEqual(data);
    });
  });

  it('should return an empty array if no data is provided', async () => {
    const { result } = renderHook(() => useSort());

    await waitFor(() => {
      expect(result.current.sort).toEqual(undefined);
      expect(result.current.sortedData).toEqual([]);
    });
  });

  it('sorts list accordingly', async () => {
    const { result } = renderHook(() => useSort({ defaultSort: 'prop1:desc', data }));

    result.current.toggleSort('prop2');

    await waitFor(() => {
      expect(result.current.sort).toEqual('prop2:desc');
      expect(result.current.sortedData).toEqual(data.sort((a, b) => (b.prop2 > a.prop2 ? 1 : -1)));
    });

    result.current.toggleSort('prop2');

    await waitFor(() => {
      expect(result.current.sort).toEqual('prop2:asc');
      expect(result.current.sortedData).toEqual(data.sort((a, b) => (b.prop2 < a.prop2 ? 1 : -1)));
    });

    result.current.toggleSort('prop1');

    await waitFor(() => {
      expect(result.current.sort).toEqual('prop1:desc');
      expect(result.current.sortedData).toEqual(data.sort((a, b) => (b.prop1 > a.prop1 ? 1 : -1)));
    });

    result.current.toggleSort('prop1');

    await waitFor(() => {
      expect(result.current.sort).toEqual('prop1:asc');
      expect(result.current.sortedData).toEqual(data.sort((a, b) => (b.prop1 < a.prop1 ? 1 : -1)));
    });
  });
});
