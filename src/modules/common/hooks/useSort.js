const { useState, useCallback } = require('react');

// eslint-disable-next-line import/prefer-default-export
export function useSort({ defaultSort, defaultSortOrder = 'desc' }) {
  const [sort, setSort] = useState(defaultSort);

  const toggleSort = useCallback((param) => {
    const [prevSortParam, prevSortOrder] = sort.split(':');

    if (prevSortParam === param) {
      setSort(`${param}:${prevSortOrder === 'desc' ? 'asc' : 'desc'}`);
      return;
    }
    setSort(`${param}:${defaultSortOrder}`);
  }, [sort]);

  return { sort, toggleSort };
}
