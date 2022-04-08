import history from '@common/utilities/history';

const sendRegex = /^\/(wallet|wallet\/send|main\/transactions\/send)$/;
const sendRedirect = '/wallet?modal=send';

const voteRegex = /^\/(main\/voting\/vote|delegates\/vote|vote)$/;
const voteRedirect = '/wallet?modal=votingQueue';

export default {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('openUrl', (_, url) => {
        const urlDetails = new URL(url);
        const { protocol, href, search } = urlDetails;

        // Due to some bug with URL().pathname displaying a blank string
        // instead of the correct pathname, it was best to use href with a regex
        const normalizedUrl = href.match(/\/\w+/)[0];
        const searchParams = search.slice(1);
        if (protocol?.slice(0, -1).toLowerCase() === 'lisk' && normalizedUrl) {
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
