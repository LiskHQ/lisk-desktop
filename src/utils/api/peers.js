import { loadingStarted, loadingFinished } from '../../utils/loading';

/* eslint-disable  */
export const requestToActivePeer = (activePeer, path, urlParams) =>
  new Promise((resolve, reject) => {
    loadingStarted(path);
    activePeer.sendRequest(path, urlParams, (data) => {
      if (data.success) {
        resolve(data);
      } else {
        reject(data);
      }
      loadingFinished(path);
    });
  });
/* eslint-enable */
