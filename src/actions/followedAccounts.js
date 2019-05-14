import actionTypes from '../constants/actions';

export const followedAccountAdded = ({ account, token = 'LSK' }) => ({
  data: { account, token },
  type: actionTypes.followedAccountAdded,
});

export const followedAccountUpdated = ({ account, token = 'LSK' }) => ({
  data: { account, token },
  type: actionTypes.followedAccountUpdated,
});

export const followedAccountRemoved = ({ address, token = 'LSK' }) => ({
  data: { address, token },
  type: actionTypes.followedAccountRemoved,
});
