import actionTypes from '../../constants/actions';

const loginMiddleware = store => next => (action) => {
  const { ipc } = window;
  switch (action.type) {
    case actionTypes.storeCreated:
      if (ipc) { // On browser-mode is undefined
        store.dispatch({
          type: actionTypes.settingsUpdated,
          data: { isHarwareWalletConnected: false },
        });
      }
      break;
    default: break;
  }
  next(action);
};

export default loginMiddleware;
