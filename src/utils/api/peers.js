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

