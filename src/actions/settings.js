import actionTypes from '../constants/actions';
import { tokenKeys } from '../constants/tokens';
import { getFromStorage } from '../utils/localJSONStorage';

/**
 * An action to dispatch settingsRetrieved
 *
 */
export const settingsRetrieved = () => (dispatch) => {
  const initialSettings = {
    autoLog: true,
    showNetwork: false,
    channels: {
      academy: false,
      twitter: true,
      blog: false,
      github: false,
      reddit: false,
    },
    hardwareAccounts: {},
    isRequestHowItWorksDisable: false,
    statistics: false,
    areTermsOfUseAccepted: false,
    discreetMode: false,
    token: {
      active: tokenKeys[0],
      list: tokenKeys.reduce((acc, key) => { acc[key] = true; return acc; }, {}),
    },
  };
  getFromStorage('settings', initialSettings, (data) => {
    dispatch({
      type: actionTypes.settingsRetrieved,
      data,
    });
  });
};

/**
 * An action to dispatch settingsUpdated
 *
 */
export const settingsUpdated = data => ({
  type: actionTypes.settingsUpdated,
  data,
});
/**
 * An action to dispatch settingsReset
 *
 */
export const settingsReset = () => ({
  type: actionTypes.settingsReset,
});
