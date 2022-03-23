import { actionTypes } from '@common/configuration';

// eslint-disable-next-line import/prefer-default-export
export const appUpdateAvailable = data => ({
  type: actionTypes.appUpdateAvailable,
  data,
});
