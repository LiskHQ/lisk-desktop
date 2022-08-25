const { useState, useCallback, useMemo } = require('react');

// eslint-disable-next-line import/prefer-default-export
export function useSort({ defaultSort, data = [] } = {}) {
  const [sort, setSort] = useState(defaultSort);

  const sortedData = useMemo(() => {
    if (!sort || !data.length) return data;

    const [sortParam, sortOrder] = sort.split(':');

    return data.sort((a, b) => {
      if (sortOrder === 'desc') return b[sortParam] > a[sortParam] ? 1 : -1;
      if (sortOrder === 'asc') return b[sortParam] < a[sortParam] ? 1 : -1;
      return -1;
    });
  }, [data, sort]);

  const toggleSort = useCallback((param) => {
    const [prevSortParam, prevSortOrder] = sort.split(':');

    if (prevSortParam === param) {
      setSort(`${param}:${prevSortOrder === 'desc' ? 'asc' : 'desc'}`);
      return;
    }
    setSort(`${param}:desc`);
  }, [sort]);

  return { sort, toggleSort, sortedData };
}
