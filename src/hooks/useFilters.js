import { useState } from 'react';

const useFilters = ({ urlSearchParams, loadData, clearData }) => {
  const [filters, setFilters] = useState(urlSearchParams);
  const applyFilters = (f) => {
    setFilters(f);
    clearData();
    loadData(Object.keys(f).reduce((acc, key) => ({
      ...acc,
      ...(f[key] && { [key]: f[key] }),
    }), {}));
  };
  const clearFilter = (name) => {
    delete filters[name];
    applyFilters(filters);
  };
  const clearAllFilters = () => {
    applyFilters({});
  };
  return [filters, applyFilters, clearFilter, clearAllFilters];
};

export default useFilters;
