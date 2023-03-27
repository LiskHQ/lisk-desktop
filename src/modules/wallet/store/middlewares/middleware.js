import { accountDataUpdated } from 'src/redux/actions';
import settingsActionTypes from 'src/modules/settings/store/actionTypes';

const accountMiddleware = (store) => (next) => async (action) => {
  next(action);
  // @todo Update token storage when new token management system is ready
  switch (action.type) {
    case settingsActionTypes.settingsUpdated:
      if (action.data.token && store.getState().wallet.info) {
        store.dispatch(accountDataUpdated('enabled'));
      }
      break;
    default:
      break;
  }
};

export default accountMiddleware;
