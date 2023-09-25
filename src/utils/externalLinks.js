import history from 'src/utils/history';
import { IPC_OPEN_URL } from 'src/const/ipcGlobal';
import { canExecuteDeepLinking } from '../../app/src/utils';

export const externalLinks = {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc[IPC_OPEN_URL]((_, url) => {
        if (!canExecuteDeepLinking(url)) return;

        const { pathname, search } = new URL(url);
        const path = pathname.replace(/^\//, '');
        const redirectUrl = `${path}${search}`;

        history.push(redirectUrl);
      });
    }
  },
};
