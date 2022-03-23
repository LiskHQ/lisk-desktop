import { actionTypes, tokenMap } from '@common/configuration';
import { getFromStorage } from '@common/utilities/localJSONStorage';
import { initialState } from '@store/reducers/settings';

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
            [tokenMap.BTC.key]: false,
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
