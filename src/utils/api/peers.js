// eslint-disable-next-line import/prefer-default-export
export const requestToActivePeer = (activePeer, path, urlParams) =>
  new Promise((resolve, reject) => {
    activePeer.sendRequest(path, urlParams, (data) => {
      if (data.success) {
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
