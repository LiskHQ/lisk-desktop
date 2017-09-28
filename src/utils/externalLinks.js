import history from '../history';

export default {
  init: () => {
    const { ipc } = window;
    const protocolReg = /[lL][iI][sS][kK]:\/\//;

    if (ipc) {
      ipc.on('openUrl', (action, url) => {
        history.push(url.replace(protocolReg, '/'));
      });
    }
  },
};

