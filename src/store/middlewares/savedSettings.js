import actionsType from '../../constants/actions';

const savedSettingsMiddleware = store => next => (action) => {
  next(action);
  const Settings = store.getState().settings;
  switch (action.type) {
    case actionsType.settingsUpdated:
      localStorage.setItem('settings', JSON.stringify(Settings));
      break;
    case actionsType.settingsReset:
      localStorage.removeItem('settings');
      break;
    default: break;
  }
};

export default savedSettingsMiddleware;
