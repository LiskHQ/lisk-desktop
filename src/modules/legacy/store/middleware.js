import routes from '@screens/router/routes';
import history from '@common/utilities/history';
import actionTypes from '@wallet/store/actionTypes';

const checkAccountMigrationState = (action) => {
  if (action.type === actionTypes.accountLoggedIn) {
    const { isMigrated } = action.data.info.LSK.summary;
    // we need to check against false, check against falsy won't work
    if (isMigrated === false) {
      history.push(routes.reclaim.path);
    }
  }
};

const legacyMiddleware = () => next => async (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountUpdated:
    case actionTypes.accountLoggedIn: {
      checkAccountMigrationState(action);
      break;
    }
    default: break;
  }
};

export default legacyMiddleware;
