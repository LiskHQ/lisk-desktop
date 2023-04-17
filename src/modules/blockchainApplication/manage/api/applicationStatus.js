import client from 'src/utils/api/client';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  applicationStatus: `${HTTP_PREFIX}/application/status`,
};

/**
 * Retrieves status information of the application
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 *
 * @returns {Promise}
 */
export const getApplicationStatus = ({ baseUrl }) =>
  client.rest({
    baseURL: baseUrl,
    url: httpPaths.applicationStatus,
  });

/**
 * Returns network config to use for future API calls.
 *
 * @param {Object} network
 * @param {String} network.serviceUrl - a valid URL pointing to a running node
 * @returns {Promise}
 */
export const getApplicationConfig = ({ serviceUrl }) =>
  getApplicationStatus({ baseUrl: serviceUrl })
    .then((response) => ({
      ...response.data,
      serviceUrl,
    }))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      // throw Error(`Can not connect to ${address}`);
    });
