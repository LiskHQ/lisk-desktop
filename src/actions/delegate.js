import actionTypes from '../constants/actions';

// eslint-disable-next-line import/prefer-default-export
export const delegateRegisteredFailure = data => ({
  type: actionTypes.delegateRegisteredFailure,
  data,
});
