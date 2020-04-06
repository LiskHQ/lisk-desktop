import actionsType from '../../constants/actions';
import { pricesRetrieved } from '../../actions/service';
import { emptyTransactionsData } from '../../actions/transactions';
import { setInStorage } from '../../utils/localJSONStorage';

const settings = store => next => (action) => {
  const { token } = store.getState().settings;
  switch (action.type) {
    case actionsType.settingsUpdated:
      next(action);
      if (action.data.token && action.data.token.active !== token.active) {
        store.dispatch(pricesRetrieved());
        store.dispatch(emptyTransactionsData());
      }
      setInStorage('settings', store.getState().settings);
      break;
    default:
      next(action);
      break;
  }
};

export default settings;
