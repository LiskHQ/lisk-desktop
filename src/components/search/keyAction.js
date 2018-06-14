import localJSONStorage from './../../utils/localJSONStorage';
/* eslint-disable import/prefer-default-export */
export const saveSearch = (search) => {
  if (search.length === 0) return;

  const recent = localJSONStorage.get('searches', []);
  const updated = [search].concat(recent.filter(term => term !== search)).slice(0, 3);
  localJSONStorage.set('searches', updated);
};
