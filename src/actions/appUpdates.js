import actionTypes from '../constants/actions';

// eslint-disable-next-line import/prefer-default-export
export const appUpdateAvaiable = data => ({
  type: actionTypes.appUpdateAvailable,
  data,
});
