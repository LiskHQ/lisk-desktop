import actionsType from 'constants';
import { pricesRetrieved } from '../../actions/service';
import { emptyTransactionsData } from '../../actions/transactions';
import { setInStorage } from '../../utils/localJSONStorage';

const settings = store => next => (action) => {
  const { token } = store.getState().settings;
  next(action);
  switch (action.type) {
    case actionsType.networkConfigSet:
      store.dispatch(pricesRetrieved());
      break;
    case actionsType.settingsUpdated:
      if (action.data.token && action.data.token.active !== token.active) {
        store.dispatch(emptyTransactionsData());
      }
      setInStorage('settings', store.getState().settings);
      break;
    default:
      break;
  }
};

export default settings;
