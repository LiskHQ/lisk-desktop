import actionsType from '../../constants/actions';
import { pricesRetrieved } from '../../actions/service';
import { cleanTransactions } from '../../actions/transactions';
import { setSettingsInLocalStorage } from '../../utils/settings';

const settings = store => next => (action) => {
  switch (action.type) {
    case actionsType.settingsUpdated:
      next(action);
      if (action.data.token) {
        store.dispatch(pricesRetrieved());
        store.dispatch(cleanTransactions());
      }
      setSettingsInLocalStorage(store.getState().settings);
      break;
    default:
      next(action);
      break;
  }
};

export default settings;
