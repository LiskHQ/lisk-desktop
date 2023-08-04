import history from 'src/utils/history';
import { IPC_OPEN_URL } from 'src/const/ipcGlobal';

const sendRegex = /^\/(wallet|wallet\/send|main\/transactions\/send)$/;
const sendRedirect = '/wallet?modal=send';

const stakeRegex = /^\/(main\/staking\/stake|validator\/stake|stake)$/;
const stakeRedirect = '/wallet?modal=StakingQueue';

export const externalLinks = {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      // eslint-disable-next-line max-statements
      ipc[IPC_OPEN_URL]((_, url) => {
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
          } else if (normalizedUrl.match(stakeRegex)) {
            redirectUrl = stakeRedirect + (searchParams ? `&${searchParams}` : '');
          }

          // @todo do we need to both push and replace?
          history.push(redirectUrl);
          history.replace(redirectUrl);
        }
      });
    }
  },
};
