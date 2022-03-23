import thunk from 'redux-thunk';
import spy from 'redux-monitor-spy';

import account from '@wallet/store/middleware';
import block from '@block/store/middleware';
import settings from '@settings/store/middleware';
import bookmarks from '@bookmarks/store/middleware';
import network from '@network/store/middleware';
import watchList from '@dpos/store/middlewares/watchList';
import voting from '@dpos/store/middlewares/voting';
import hwManager from './hwManager';
import loading from './loadingBar';

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
