import actionTypes from '../../constants/actions';
import Notification from '../../utils/notification';

const notificationMiddleware = (store) => {
  const notify = Notification.init();
  return next => (action) => {
    const { account } = store.getState();
    next(action);

    switch (action.type) {
      case actionTypes.accountUpdated: {
        const amount = action.data.balance - account.balance;
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
