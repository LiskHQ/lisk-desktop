import actionsType from '../../constants/actions';
import { settingsUpdated } from '../../actions/settings';
import { pricesRetrieved } from '../../actions/service';

const settings = store => next => (action) => {
  switch (action.type) {
    case actionsType.settingsUpdateToken:
      next(action);
      // istanbul ignore next
      if (action.data.token) {
        store.dispatch(pricesRetrieved());
      }
      store.dispatch(settingsUpdated(store.getState().settings));
      break;
    default:
      next(action);
      break;
  }
};

export default settings;
