import actionTypes from '../constants/actions';
import { tokenMap } from '../constants/tokens';

export const bookmarkAdded = ({ account, token = tokenMap.LSK.key }) => ({
  data: { account, token },
  type: actionTypes.bookmarkAdded,
});

export const bookmarkUpdated = ({ account, token = tokenMap.LSK.key }) => ({
  data: { account, token },
  type: actionTypes.bookmarkUpdated,
});

export const bookmarkRemoved = ({ address, token = tokenMap.LSK.key }) => ({
  data: { address, token },
  type: actionTypes.bookmarkRemoved,
});
