import actionTypes from './actionTypes';

export const appUpdateAvailable = (data) => ({
  type: actionTypes.appUpdateAvailable,
  data,
});
