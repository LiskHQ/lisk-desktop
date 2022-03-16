import { actionTypes } from '@constants';
import { setInStorage } from '@utils/localJSONStorage';
import { pricesRetrieved, emptyTransactionsData, settingsUpdated } from '@actions';

const settings = store => next => (action) => {
  const { token } = store.getState().settings;
  next(action);
  switch (action.type) {
    case actionTypes.networkConfigSet:
      store.dispatch(pricesRetrieved());
      store.dispatch(settingsUpdated({
        network: {
          name: action.data.name,
          address: action.data.networks.LSK.serviceUrl,
        },
      }));
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
