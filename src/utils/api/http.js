import client from 'src/utils/api/client';
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
  baseUrl: baseURL, path: url, params, method = 'GET', network, ...restOptions
  // eslint-disable-next-line consistent-return
}) => {
  try {
    // @todo remove http function after removing the usage
    const transformResult =  async (response) => {
      if (!response.ok) {
        const { message } = await response.json();
        const error = Error(response.statusText);
        error.code = response.status;
        error.message = message;
        throw error;
      }
      return response.json();
    };
    const config = {
      baseURL,
      url,
      method,
      params,
      transformResult,
      ...restOptions,
    };

    return client.call(config)

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // return Promise.reject(Error(e));
  }
};

export default http;
