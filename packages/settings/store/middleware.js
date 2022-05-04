import { setInStorage } from '@common/utilities/localJSONStorage';
import { pricesRetrieved, emptyTransactionsData, settingsUpdated } from '@common/store/actions';
import networkActionTypes from '@network/store/actionTypes';
import actionTypes from './actionTypes';

const settings = store => next => (action) => {
  const { token } = store.getState();
  next(action);
  switch (action.type) {
    case networkActionTypes.networkConfigSet:
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
