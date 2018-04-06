import history from '../history';

export default {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('openUrl', (action, url) => {
        const normalizedUrl = url.toLowerCase().replace('lisk://', '/');
        history.push(normalizedUrl);
      });
    }
  },
};

