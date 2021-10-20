import thunk from 'redux-thunk';
import spy from 'redux-monitor-spy';

import account from './account';
import loading from './loadingBar';
import hwManager from './hwManager';
// ToDo : enable this one when you solve the problem with multi account management
// import notificationMiddleware from './notification';
import voting from './voting';
import block from './block';
import settings from './settings';
import bookmarks from './bookmarks';
import network from './network';
import watchList from './watchList';

export default [
  // notificationMiddleware,
  spy,
  account,
  bookmarks,
  hwManager,
  loading,
  network,
  settings,
  block,
  voting,
  watchList,
  thunk,
];
