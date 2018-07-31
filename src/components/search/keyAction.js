import localJSONStorage from './../../utils/localJSONStorage';
/* eslint-disable import/prefer-default-export */
export const saveSearch = (searchTerm, id) => {
  if (searchTerm.length === 0) return;
  const validSearch = searchTerm.trim();

  const recent = localJSONStorage.get('searches', []);

  const searchObj = {
    searchTerm: validSearch,
    id,
  };
  const updated = [searchObj].concat(recent.filter(term => typeof term === 'object' && term.searchTerm !== validSearch)).slice(0, 3);
  localJSONStorage.set('searches', updated);
};
