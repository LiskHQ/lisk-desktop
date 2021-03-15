import actionTypes from '../../constants/actions';
import Notification from '../../utils/notification';
import { getActiveTokenAccount } from '../../utils/account';
import { tokenMap } from '../../constants/tokens';

const notificationMiddleware = (store) => {
  const notify = Notification.init();
  return next => (action) => {
    const state = store.getState();
    const account = getActiveTokenAccount(state)
    next(action);

    switch (action.type) {
      case actionTypes.accountUpdated: {
        const amount = state.settings.token.active ===  tokenMap.LSK.key ?
          action.data.token.balance - account.token.balance
          : action.data.balance - account.balance;
        if (amount > 0) {
          notify.about('deposit', amount);
        }
        break;
      }
      default: break;
    }
  };
};

export default notificationMiddleware;
