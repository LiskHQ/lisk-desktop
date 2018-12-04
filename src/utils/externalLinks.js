import history from '../history';

export default {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('openUrl', (action, url) => {
        const protocol = url.split(':/')[0];
        let normalizedUrl = url.split(':/')[1];
        if (protocol && protocol.toLowerCase() === 'lisk' && normalizedUrl) {
          normalizedUrl = normalizedUrl
            .replace('/main/transactions/send', '/wallet/send')
            .replace('/wallet', '/wallet/send')
            .replace('/main/voting/vote', '/delegates/vote');
          history.push(normalizedUrl);
          history.replace(normalizedUrl);
          // Tests are throwing error which cannot be handled
          // ERROR Some of your tests did a full page reload!
          /* istanbul ignore if  */
          if (normalizedUrl.includes('votes')) {
            window.location.reload();
          }
        }
      });
    }
  },
};

