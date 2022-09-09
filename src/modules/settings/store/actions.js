import { getFromStorage } from 'src/utils/localJSONStorage';
import actionTypes from './actionTypes';
import { initialState } from './reducer';

/**
 * An action to dispatch settingsRetrieved
 *
 */
export const settingsRetrieved = () => (dispatch) => {
  getFromStorage('settings', initialState, (data) => {
    // For cases where token is still stored with settings data,
    // Remove token from retrieved data before storing
    delete data.token;
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
export const settingsUpdated = (data) => ({
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
