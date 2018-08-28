import i18next from 'i18next';
import { dialogDisplayed, dialogHidden } from '../actions/dialog';
import ProxyDialog from '../components/proxyDialog';
import store from '../store';

export default {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('proxyLogin', (action, authInfo) => {
        store.dispatch(dialogDisplayed({
          childComponent: ProxyDialog,
          childComponentProps: {
            title: i18next.t('Proxy Authentication'),
            text: i18next.t('To connect to Lisk network, you need to enter a username and password for proxy.'),
            authInfo,
            callback: (username, password) => ipc.send('proxyCredentialsEntered', username, password),
            closeDialog: () => store.dispatch(dialogHidden()),
          },
        }));
      });
    }
  },
};

