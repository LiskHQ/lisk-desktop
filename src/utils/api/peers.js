// eslint-disable-next-line import/prefer-default-export
export const requestToActivePeer = (
  liskAPIClient, path, urlParams,
) => new Promise((resolve, reject) => {
  liskAPIClient.sendRequest(path, urlParams, (data) => {
    if (data.success) {
      resolve(data);
    } else {
      reject(data);
    }
  });
});
