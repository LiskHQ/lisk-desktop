import history from '@common/utilities/history';

const sendRegex = /^\/(wallet|wallet\/send|main\/transactions\/send)$/;
const sendRedirect = '/wallet?modal=send';

const voteRegex = /^\/(main\/voting\/vote|delegates\/vote|vote)$/;
const voteRedirect = '/wallet?modal=votingQueue';

export default {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('openUrl', (action, url) => {
        const [protocol, rest] = url.split(':/');
        const [normalizedUrl, searchParams] = rest?.split('?') ?? [];

        if (protocol?.toLowerCase() === 'lisk' && normalizedUrl) {
          let redirectUrl = normalizedUrl;
          if (normalizedUrl.match(sendRegex)) {
            redirectUrl = sendRedirect + (searchParams ? `&${searchParams}` : '');
          } else if (normalizedUrl.match(voteRegex)) {
            redirectUrl = voteRedirect + (searchParams ? `&${searchParams}` : '');
          }

          history.push(redirectUrl);
          history.replace(redirectUrl);
        }
      });
    }
  },
};
