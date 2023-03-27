import { useState, useCallback } from 'react';

export default function useFilter(defaultFilters = {}) {
  const [filters, setFilters] = useState(defaultFilters);

  const clearFilters = useCallback(
    (params) => {
      if (params && Array.isArray(params) && params.length) {
        const copiedFilters = { ...filters };

        params.forEach((param) => {
          delete copiedFilters[param];
        });

        setFilters(copiedFilters);
        return;
      }

      setFilters({});
    },
    [filters]
  );

  const applyFilters = useCallback(
    (params) => {
      const copiedParams = { ...filters, ...params };
      Object.keys(copiedParams).forEach((key) => {
        if (typeof copiedParams[key] === 'string' && !copiedParams[key].length) {
          delete copiedParams[key];
        }
      });

      setFilters(copiedParams);
    },
    [filters]
  );

  const setFilter = useCallback(
    (key, value) => {
      applyFilters({ [key]: value });
    },
    [filters]
  );

  return {
    filters,
    applyFilters,
    clearFilters,
    setFilter,
  };
}
