import { useMemo } from 'react';
import { applyFilters } from '../services/filterService';

const useFilteredPackages = (tourPackages, filters) => {
  const filteredPackages = useMemo(() => {
    if (!tourPackages || tourPackages.length === 0) {
      return [];
    }
    
    return applyFilters(tourPackages, filters);
  }, [tourPackages, filters]);

  return filteredPackages;
};

export default useFilteredPackages; 