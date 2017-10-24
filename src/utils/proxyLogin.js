import i18next from 'i18next';
import { dialogDisplayed } from '../actions/dialog';
import ProxyDialog from '../components/proxyDialog';
import store from '../store';

export default {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('proxyLogin', (action, authInfo) => {
        store.dispatch(dialogDisplayed({
          title: i18next.t('Proxy Authentication'),
          childComponent: ProxyDialog,
          childComponentProps: {
            authInfo,
            callback: (username, password) => ipc.send('proxyCredentialsEntered', username, password),
          },
        }));
      });
    }
  },
};

