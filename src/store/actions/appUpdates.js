import actionTypes from '@constants';

// eslint-disable-next-line import/prefer-default-export
export const appUpdateAvaiable = data => ({
  type: actionTypes.appUpdateAvailable,
  data,
});
