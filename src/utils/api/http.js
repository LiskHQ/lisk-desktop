/**
 * Makes HTTP api call
 *
 * @param {object} data - object containing:
 *         - @param {string} baseUrl - optional service base url
 *         - @param {string} path - api endpoint
 *         - @param {string} params - endpoint parameters
 *         - @param {string} method - HTTP method
 *         - @param {Object} network - redux network status
 * @returns {Promise} - if success it returns data,
 * if fails on server it throws an error,
 *
 */

const http = ({
  baseUrl, path, params, method, network, ...restOptions
}) => {
  const url = baseUrl ? `${baseUrl}${path}` : `${network.serviceUrl}${path}`;
  return fetch(url, {
    method,
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
    ...restOptions,
  })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    });
};

export default http;
