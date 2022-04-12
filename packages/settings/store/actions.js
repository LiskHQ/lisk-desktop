import { tokenMap } from '@token/configuration/tokens';
import { getFromStorage } from '@common/utilities/localJSONStorage';
import actionTypes from './actionTypes';
import { initialState } from './reducer';

/**
 * An action to dispatch settingsRetrieved
 *
 */
export const settingsRetrieved = () => (dispatch) => {
  getFromStorage('settings', initialState, (data) => {
    dispatch({
      type: actionTypes.settingsRetrieved,
      data: {
        ...data,
        token: {
          active: tokenMap.LSK.key,
          list: {
            [tokenMap.LSK.key]: true,
          },
        },
      },
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
