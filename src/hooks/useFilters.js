import { useState } from 'react';

const useFilters = ({ loadData, clearData }, initialState) => {
  const [filters, setFilters] = useState(initialState);

  const applyFilters = (f) => {
    setFilters(f);
    clearData();
    loadData(Object.keys(f).reduce((acc, key) => ({
      ...acc,
      ...(f[key] && { [key]: f[key] }),
    }), {}));
  };

  const clearFilter = (name) => {
    applyFilters({
      ...filters,
      [name]: initialState[name],
    });
  };

  const clearAllFilters = applyFilters.bind(null, initialState);

  return [filters, applyFilters, clearFilter, clearAllFilters];
};

export default useFilters;
