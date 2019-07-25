/**
 * Generates setting object as needed.
 * @param {Object} options -> Object data to update generated settings as needed.
 * @returns Object with default settings to put into localStorage.
 */
const getSettings = ({ btc = false }) => ({
  areTermsOfUseAccepted: true,
  token: {
    list: {
      BTC: btc,
    },
  },
});

const settings = getSettings({});
const settingsWithBtc = getSettings({ btc: true });

const setSettings = data => window.localStorage.setItem('settings', JSON.stringify(data));

export default {
  settings,
  settingsWithBtc,
  setSettings,
};
