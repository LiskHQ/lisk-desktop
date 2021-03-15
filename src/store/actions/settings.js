import actionTypes from '@constants';
import { getFromStorage } from '@utils/localJSONStorage';
import { initialState } from '@store/reducers/settings';

/**
 * An action to dispatch settingsRetrieved
 *
 */
export const settingsRetrieved = () => (dispatch) => {
  getFromStorage('settings', initialState, (data) => {
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
