import thunk from 'redux-thunk';

import auth from '@auth/store/middleware';
import settings from 'src/modules/settings/store/middleware';
import bookmarks from '@bookmark/store/middleware';
import hwManager from '@wallet/store/middlewares/hwManager';
import loading from 'src/modules/common/store/middlewares/loadingBar';

export default [auth, bookmarks, hwManager, loading, settings, thunk];
