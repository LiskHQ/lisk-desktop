import { dialogDisplayed } from '../actions/dialog';
import ProxyDialog from '../components/proxyDialog';
import store from '../store';

export default {
  init: () => {
    const { ipc } = window;

    ipc.on('proxyLogin', (action, authInfo) => {
      store.dispatch(dialogDisplayed({
        title: 'Proxy Authentication',
        childComponent: ProxyDialog,
        childComponentProps: {
          authInfo,
          callback: (username, password) => ipc.send('proxyCredentialsEntered', username, password),
        },
      }));
    });
  },
};

