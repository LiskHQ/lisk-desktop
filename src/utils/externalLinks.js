import history from '../history';

export default {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('openUrl', (action, url) => {
        const normalizedUrl = url
          .replace('lisk://', '/')
          .replace('/main/transactions/send', '/wallet')
          .replace('/main/voting/vote', '/delegates/vote');
        history.push(normalizedUrl);
        history.replace(normalizedUrl);
        // Tests are throwing error which cannot be handled
        // ERROR Some of your tests did a full page reload!
        /* istanbul ignore if  */
        if (normalizedUrl.includes('votes')) {
          window.location.reload();
        }
      });
    }
  },
};

