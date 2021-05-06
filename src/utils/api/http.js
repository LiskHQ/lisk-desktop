/**
 * Makes HTTP api call
 *
 * @param {string} baseUrl - optional service base url
 * @param {string} path - api endpoint
 * @param {string} method - HTTP method
 * @param {string} params - HTTP call parameters
 * @param {Object} network - redux network status
 * @param {string} network.serviceUrl - service base url
 * @returns {Promise} - if success it returns data,
 * if fails on server it throws an error,
 *
 */

const http = ({
  baseUrl, path, params, method = 'GET', network, ...restOptions
}) => {
  try {
    const url = new URL(baseUrl ? `${baseUrl}${path}`
      : `${network.networks.LSK.serviceUrl}${path}`);
    url.search = new URLSearchParams(params).toString();

    return fetch(url.toString(), {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...restOptions,
    })
      .then((response) => {
        if (!response.ok) {
          const error = Error(response.statusText);
          error.code = response.status;
          throw error;
        }
        return response.json();
      });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // return Promise.reject(Error(e));
  }
};

export default http;
