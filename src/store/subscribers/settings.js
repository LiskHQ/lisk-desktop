import { setSettingsInLocalStorage } from '../../utils/settings';

const settingsSubscriber = (store) => {
  const { settings } = store.getState();
  setSettingsInLocalStorage(settings);
};

export default settingsSubscriber;
