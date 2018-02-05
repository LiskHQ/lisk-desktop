import localJSONStorage from './../../utils/localJSONStorage';
import keyCodes from './../../constants/keyCodes';
import routes from './../../constants/routes';
import regex from './../../utils/regex';

const saveSearch = (search) => {
  if (search.length === 0) return;

  let recent;

  try {
    recent = localJSONStorage.get('searches');
  } catch (e) {
    recent = [];
  }

  const updated = [search].concat(recent.filter(term => term !== search)).slice(0, 3);
  localJSONStorage.set('searches', updated);
};

export default (event, history) => {
  if (event.which === keyCodes.enter) {
    const value = event.target.value.trim();
    saveSearch(value);

    if (value.match(regex.address)) {
      history.push(`${routes.account.long}/${value}`);
    }

    if (value.match(regex.transactionId)) {
      // TODO: will be implemented in #246
      history.push('/');
    }

    // TODO: case of no match
  }
};
