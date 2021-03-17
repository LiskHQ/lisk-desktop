import { actionTypes } from '@constants';
import { setInStorage } from '@utils/localJSONStorage';
import { pricesRetrieved, emptyTransactionsData } from '@actions';

const settings = store => next => (action) => {
  const { token } = store.getState().settings;
  next(action);
  switch (action.type) {
    case actionTypes.networkConfigSet:
      store.dispatch(pricesRetrieved());
      break;
    case actionTypes.settingsUpdated:
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
