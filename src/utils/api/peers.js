import { loadingStarted, loadingFinished } from '../../utils/loading';

const requestToActivePeer = (activePeer, path, urlParams) =>
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


const getNethash = activePeer => (requestToActivePeer(activePeer, 'blocks/getNethash'));

export { requestToActivePeer, getNethash };
