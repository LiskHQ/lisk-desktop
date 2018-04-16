import localJSONStorage from './../../utils/localJSONStorage';
import keyCodes from './../../constants/keyCodes';
import routes from './../../constants/routes';
import regex from './../../utils/regex';

const saveSearch = (search) => {
  if (search.length === 0) return;

  const recent = localJSONStorage.get('searches', []);
  const updated = [search].concat(recent.filter(term => term !== search)).slice(0, 3);
  localJSONStorage.set('searches', updated);
};

export const visit = (value, history) => {
  if (value.match(regex.address)) {
    history.push(`${routes.explorer.path}${routes.accounts.path}/${value}`);
  } else if (value.match(regex.transactionId)) {
    history.push(`${routes.explorer.path}${routes.transactions.path}/${value}`);
  } else {
    history.push(`${routes.explorer.path}${routes.searchResult.path}/${value}`);
  }
};

export const visitAndSaveSearch = (value, history) => {
  if (value.length === 0) {
    history.push(`${routes.explorer.path}${routes.search.path}`);
  } else {
    value = value.trim();
    saveSearch(value);
    visit(value, history);
  }
};

export const visitAndSaveSearchOnEnter = (event, history) => {
  if (event.which === keyCodes.enter) {
    visitAndSaveSearch(event.target.value, history);
  }
};
