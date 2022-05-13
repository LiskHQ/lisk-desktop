import { toast } from 'react-toastify';
import { timeOutId, timeOutWarningId } from 'src/utils/toasts';
import actionTypes from './actionTypes';

const authMiddleware = () => next => async (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountLoggedIn: {
      toast.dismiss(timeOutId);
      toast.dismiss(timeOutWarningId);
      break;
    }
    default: break;
  }
};

export default authMiddleware;
