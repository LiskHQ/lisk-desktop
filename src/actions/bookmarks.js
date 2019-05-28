import actionTypes from '../constants/actions';

export const bookmarkAdded = ({ account, token = 'LSK' }) => ({
  data: { account, token },
  type: actionTypes.bookmarkAdded,
});

export const bookmarkUpdated = ({ account, token = 'LSK' }) => ({
  data: { account, token },
  type: actionTypes.bookmarkUpdated,
});

export const bookmarkRemoved = ({ address, token = 'LSK' }) => ({
  data: { address, token },
  type: actionTypes.bookmarkRemoved,
});
