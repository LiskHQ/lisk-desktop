import { useState, useCallback, useMemo } from 'react';

export default function useSort({ defaultSort, data = [] } = {}) {
  const [sort, setSort] = useState(defaultSort);

  const sortedData = useMemo(() => {
    if (!sort || !data.length) return data;

    const [sortParam, sortOrder] = sort.split(':');

    return data.sort((a, b) => {
      if (sortOrder === 'desc') return (b[sortParam] || 0) > (a[sortParam] || 0) ? 1 : -1;
      if (sortOrder === 'asc') return (b[sortParam] || 0) < (a[sortParam] || 0) ? 1 : -1;
      return -1;
    });
  }, [data, sort]);

  const toggleSort = useCallback(
    (param) => {
      const [prevSortParam, prevSortOrder] = sort?.split?.(':') || [];

      if (prevSortParam === param) {
        setSort(`${param}:${prevSortOrder === 'desc' ? 'asc' : 'desc'}`);
        return;
      }
      setSort(`${param}:desc`);
    },
    [sort]
  );

  return { sort, toggleSort, sortedData };
}
