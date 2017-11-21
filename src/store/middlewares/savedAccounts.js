import i18next from 'i18next';
import actionTypes from '../../constants/actions';
import { successToastDisplayed } from '../../actions/toaster';
import { accountLoggedOut } from '../../actions/account';
import { activePeerSet } from '../../actions/peers';
import getNetwork from '../../utils/getNetwork';

const savedAccountsMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.accountSaved:
      store.dispatch(successToastDisplayed({ label: i18next.t('Account saved') }));
      break;
    case actionTypes.accountRemoved:
      store.dispatch(successToastDisplayed({ label: i18next.t('Account was successfully forgotten.') }));
      break;
    case actionTypes.accountSwitched:
      store.dispatch(accountLoggedOut());
      store.dispatch(activePeerSet({
        publicKey: action.data.publicKey,
        network: {
          ...getNetwork(action.data.network),
          address: action.data.address,
        },
      }));
      break;
    default:
      break;
  }
};

export default savedAccountsMiddleware;
