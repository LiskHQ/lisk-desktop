import { actionTypes } from '@constants';

/**
 * An action to dispatch loadingStarted
 *
 */
export const loadingStarted = data => ({
  data,
  type: actionTypes.loadingStarted,
});

/**
 * An action to dispatch loadingFinished
 *
 */
export const loadingFinished = data => ({
  data,
  type: actionTypes.loadingFinished,
});
