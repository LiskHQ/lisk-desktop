import thunk from 'redux-thunk';

import auth from '@auth/store/middleware';
import bookmarks from '@bookmark/store/middleware';
import validators from '@pos/validator/store/middlewares/validators';
import hwManager from '@wallet/store/middlewares/hwManager';
import loading from 'src/modules/common/store/middlewares/loadingBar';

export default [auth, bookmarks, hwManager, loading, validators, thunk];
