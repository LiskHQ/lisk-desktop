import actionsType from '../../constants/actions';

const savedSettingsMiddleware = store => next => (action) => {
  next(action);
  const Settings = store.getState().settings;
  if (action.type === actionsType.autoLogChanged ||
    action.type === actionsType.advancedModeChanged) {
    localStorage.setItem('settings', JSON.stringify(Settings));
  }
};

export default savedSettingsMiddleware;
