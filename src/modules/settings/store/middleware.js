import { pricesRetrieved, settingsUpdated } from 'src/redux/actions';
import networkActionTypes from '@network/store/actionTypes';

const settings = (store) => (next) => (action) => {
  next(action);
  switch (action.type) {
    case networkActionTypes.networkConfigSet:
      store.dispatch(pricesRetrieved());
      store.dispatch(
        settingsUpdated({
          network: {
            name: action.data.name,
            address: action.data.networks.LSK?.serviceUrl,
          },
        })
      );
      break;
    default:
      break;
  }
};

export default settings;
