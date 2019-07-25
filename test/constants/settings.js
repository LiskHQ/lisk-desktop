import { deepMergeObj } from '../../src/utils/helpers';

/**
 * Generates setting object as needed.
 * @param {Object} options -> Object data to update generated settings as needed.
 * @returns Object with default settings to put into localStorage.
 */
const getSettings = ({ btc = false, showNetwork = false }) => ({
  areTermsOfUseAccepted: true,
  showNetwork,
  token: {
    list: {
      BTC: btc,
    },
  },
});

const settingsWithBtc = getSettings({ btc: true });

const setSettingsInLocalStorage = (data) => {
  const localSettings = JSON.parse(window.localStorage.getItem('settings')) || {};
  window.localStorage.setItem('settings', JSON.stringify(deepMergeObj(localSettings, data)));
};

export default {
  settingsWithBtc,
  setSettingsInLocalStorage,
  getSettings,
};
