import actionTypes from '../constants/actions';

/**
 * An action to dispatch settingsUpdated
 *
 */
export const settingsUpdated = data => ({
  data,
  type: actionTypes.settingsUpdated,
});

/**
 * An action to dispatch settingsReset
 *
 */
export const settingsReset = () => ({
  type: actionTypes.settingsReset,
});

/**
 * An action to dispatch settingsTokenUpdate
 *
 */
export const settingsUpdateToken = data => ({
  type: actionTypes.settingsUpdateToken,
  data,
});
