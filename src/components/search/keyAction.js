import localJSONStorage from './../../utils/localJSONStorage';
/* eslint-disable import/prefer-default-export */
export const saveSearch = (search) => {
  if (search.length === 0) return;
  const validSearch = search.trim();

  const recent = localJSONStorage.get('searches', []);
  const updated = [validSearch].concat(recent.filter(term => term !== validSearch)).slice(0, 3);
  localJSONStorage.set('searches', updated);
};
