import i18next from 'i18next';
import { toast } from 'react-toastify';
import actionsType from '../../constants/actions';
import { loadingStarted, loadingFinished } from '../../actions/loading';
import { tokenMap } from '../../constants/tokens';

const getErrorMessage = (errorCode, address) => {
  let message = i18next.t('Failed to connect to node');
  switch (errorCode) {
    case 'EUNAVAILABLE':
      message = i18next.t('Failed to connect: Node {{address}} is not active', { address });
      break;
    case 'EPARSE':
      message += i18next.t(' Make sure that you are using the latest version of Lisk.');
      break;
    default: break;
  }
  return message;
};

const offlineMiddleware = store => next => (action) => {
  const state = store.getState();
  const { network, settings } = state;
  switch (action.type) {
    case actionsType.liskAPIClientUpdate:
      if (action.data.online === false && network.status.online === true) {
        const address = state.network.networks[settings.token.active || tokenMap.LSK.key].nodeUrl;
        const label = getErrorMessage(action.data.code, address);
        toast.error(label);
        store.dispatch(loadingStarted('offline'));
      } else if (action.data.online === true && network.status.online === false) {
        toast.success(i18next.t('Connection re-established'));
        store.dispatch(loadingFinished('offline'));
      }
      if (action.data.online !== network.status.online) {
        next(action);
      }
      break;
    default:
      next(action);
      break;
  }
};

export default offlineMiddleware;
