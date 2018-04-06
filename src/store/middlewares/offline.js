import i18next from 'i18next';
import actionsType from '../../constants/actions';
import { successToastDisplayed, errorToastDisplayed } from '../../actions/toaster';
import { loadingStarted, loadingFinished } from '../../actions/loading';

const getErrorMessage = (errorCode, address) => {
  let message = i18next.t('Failed to connect to node');
  switch (errorCode) {
    case 'EUNAVAILABLE':
      message = i18next.t('Failed to connect: Node {{address}} is not active', { address });
      break;
    case 'EPARSE':
      message += i18next.t(' Make sure that you are using the latest version of Lisk Hub.');
      break;
    default: break;
  }
  return message;
};

const offlineMiddleware = store => next => (action) => {
  const state = store.getState();
  switch (action.type) {
    case actionsType.activePeerUpdate:
      if (action.data.online === false && state.peers.status.online === true) {
        const address = `${state.peers.data.currentPeer}:${state.peers.data.port}`;
        const label = getErrorMessage(action.data.code, address);
        store.dispatch(errorToastDisplayed({ label }));
        store.dispatch(loadingStarted('offline'));
      } else if (action.data.online === true && state.peers.status.online === false) {
        store.dispatch(successToastDisplayed({ label: i18next.t('Connection re-established') }));
        store.dispatch(loadingFinished('offline'));
      }
      if (action.data.online !== state.peers.status.online) {
        next(action);
      }
      break;
    default:
      next(action);
      break;
  }
};

export default offlineMiddleware;
