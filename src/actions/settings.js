import actionTypes from '../constants/actions';

/**
 * An action to dispatch autoLogChanged
 *
 */
export const autoLogChanged = data => ({
  data,
  type: actionTypes.autoLogChanged,
});

/**
 * An action to dispatch advanceModeChanged
 *
 */
export const advanceModeChanged = data => ({
  data,
  type: actionTypes.advancedModeChanged,
});
