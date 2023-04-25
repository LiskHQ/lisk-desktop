import client from 'src/utils/api/client';
/**
 * Makes HTTP api call
 *
 * @param {string} baseUrl - optional service base url
 * @param {string} path - api endpoint
 * @param {string} method - HTTP method
 * @param {string} params - HTTP call parameters
 * @returns {Promise} - if success it returns data,
 * if fails on server it throws an error,
 *
 */

const http = ({
  baseUrl: baseURL,
  path: url,
  params,
  method = 'GET',
  ...restOptions
  // eslint-disable-next-line consistent-return
}) => {
  try {
    /* istanbul ignore next */
    const transformResult = async (response) => {
      if (!response.ok) {
        const { message } = await response.json();
        const error = new Error(response.statusText);
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

    return client.rest(config);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

export default http;
