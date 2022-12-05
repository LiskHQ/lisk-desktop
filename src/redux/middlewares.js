import thunk from 'redux-thunk';

import account from '@wallet/store/middlewares/middleware';
import auth from '@auth/store/middleware';
import settings from 'src/modules/settings/store/middleware';
import bookmarks from '@bookmark/store/middleware';
import network from '@network/store/middleware';
import watchList from '@dpos/validator/store/middlewares/watchList';
import voting from '@dpos/validator/store/middlewares/voting';
import hwManager from '@wallet/store/middlewares/hwManager';
import loading from 'src/modules/common/store/middlewares/loadingBar';

export default [
  account,
  auth,
  bookmarks,
  hwManager,
  loading,
  network,
  settings,
  voting,
  watchList,
  thunk,
];
