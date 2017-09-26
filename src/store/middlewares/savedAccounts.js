import actionTypes from '../../constants/actions';
import { successToastDisplayed } from '../../actions/toaster';

const savedAccountsMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountSaved:
      store.dispatch(successToastDisplayed({ label: 'Account saved' }));
      break;
    case actionTypes.accountRemoved:
      store.dispatch(successToastDisplayed({ label: 'Account was successfully forgotten.' }));
      break;
    default:
      break;
  }
};

export default savedAccountsMiddleware;
