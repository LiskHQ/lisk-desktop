import { useState, useCallback, useEffect } from 'react';

export default function useFilter(inputFilters = {}) {
  const [filters, setFilters] = useState(inputFilters);

  const clearFilters = useCallback(
    (params) => {
      if (params && Array.isArray(params) && params.length) {
        const copiedFilters = { ...filters };

        params.forEach((param) => {
          copiedFilters[param] = inputFilters[param];
        });

        setFilters(copiedFilters);
        return;
      }

      setFilters(inputFilters);
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

  useEffect(() => {
    const areFiltersChanged =
      Object.entries(filters).sort().toString() !== Object.entries(inputFilters).sort().toString();
    if (areFiltersChanged) {
      setFilters(inputFilters);
    }
  }, [inputFilters]);

  return {
    filters,
    applyFilters,
    clearFilters,
    setFilter,
  };
}
