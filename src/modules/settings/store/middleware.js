import { setInStorage } from 'src/utils/localJSONStorage';
import { pricesRetrieved, settingsUpdated } from 'src/redux/actions';
import networkActionTypes from '@network/store/actionTypes';
import actionTypes from './actionTypes';

const settings = store => next => (action) => {
  next(action);
  switch (action.type) {
    case networkActionTypes.networkConfigSet:
      store.dispatch(pricesRetrieved());
      store.dispatch(settingsUpdated({
        network: {
          name: action.data.name,
          address: action.data.networks.LSK?.serviceUrl,
        },
      }));
      break;
    case actionTypes.settingsUpdated:
      setInStorage('token', store.getState().token);
      break;
    default:
      break;
  }
};

export default settings;
