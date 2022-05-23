import thunk from 'redux-thunk';

import account from '@wallet/store/middleware';
import auth from '@auth/store/middleware';
import block from '@block/store/middleware';
import settings from 'src/modules/settings/store/middleware';
import bookmarks from '@bookmark/store/middleware';
import network from '@network/store/middleware';
import watchList from '@dpos/validator/store/middlewares/watchList';
import voting from '@dpos/validator/store/middlewares/voting';
import hwManager from './hwManager';
import loading from './loadingBar';

export default [
  account,
  auth,
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
