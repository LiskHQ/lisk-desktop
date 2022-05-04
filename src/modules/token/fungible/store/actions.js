import { getFromStorage } from '@common/utilities/localJSONStorage';
import actionTypes from './actionTypes';
import { initialState } from './reducer';

/**
 * An action to dispatch tokenRetrieved
 *
 */
export const tokenRetrieved = () => (dispatch) => {
  getFromStorage('token', initialState, (data) => {
    dispatch({
      type: actionTypes.tokenRetrieved,
      data,
    });
  });
};

/**
 * An action to dispatch tokenUpdated
 *
 */
export const tokenUpdated = data => ({
  type: actionTypes.tokenUpdated,
  data,
});

/**
 * An action to dispatch tokenUpdated
 *
 */
export const tokenReset = () => ({
  type: actionTypes.tokenReset,
});
