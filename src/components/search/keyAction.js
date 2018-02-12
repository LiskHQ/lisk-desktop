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
    history.push(`${routes.account.long}/${value}`);
  } else if (value.match(regex.transactionId)) {
    history.push(`${routes.transaction.long}/${value}`);
  } else {
    history.push(`${routes.searchResult.long}/${value}`);
  }
};

export const visitAndSaveSearch = (event, history) => {
  if (event.which === keyCodes.enter) {
    const value = event.target.value.trim();
    saveSearch(value);
    visit(value, history);
  }
};
