import thunk from 'redux-thunk';
import spy from 'redux-monitor-spy';

import account from './account';
import loading from './loadingBar';
import hwManager from './hwManager';
import voting from './voting';
import block from './block';
import settings from './settings';
import bookmarks from './bookmarks';
import network from './network';
import watchList from './watchList';

export default [
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
