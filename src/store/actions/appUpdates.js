import { actionTypes } from '@constants';

// eslint-disable-next-line import/prefer-default-export
export const appUpdateAvailable = data => ({
  type: actionTypes.appUpdateAvailable,
  data,
});
