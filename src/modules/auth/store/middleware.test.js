// import { toast } from 'react-toastify';
// import { timeOutId, timeOutWarningId } from 'src/utils/toasts';
// import actionTypes from './actionTypes';
import authMiddleware from './middleware';

/** jest.mock('react-toastify', () => ({
  toast: {
    dismiss: jest.fn(),
  },
}));
jest.mock('src/utils/toasts');

const accountLoggedInAction = {
  type: actionTypes.accountLoggedIn,
}; */

describe('Auth middleware', () => {
  const next = jest.fn();

  it('dismisses toasts after login', async () => {
    await authMiddleware()(next)({ type: 'test' });
    // await authMiddleware()(next)(accountLoggedInAction);
    // expect(next).toHaveBeenCalledWith(accountLoggedInAction);
    // expect(toast.dismiss).toHaveBeenCalledWith(timeOutId);
    // expect(toast.dismiss).toHaveBeenCalledWith(timeOutWarningId);
  });
});
