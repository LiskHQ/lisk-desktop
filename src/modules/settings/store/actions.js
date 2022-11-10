import actionTypes from './actionTypes';

/**
 * An action to dispatch settingsRetrieved
 *
 */
export const settingsRetrieved = () => (dispatch) => {
  // This action has been removed from the reducer and
  // empty object was sent as data for the time being because
  // some actions in the network middleware depend on this action.
  // As such, refactoring them completely is needed before removing this action
  dispatch({
    type: actionTypes.settingsRetrieved,
    data: {},
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
