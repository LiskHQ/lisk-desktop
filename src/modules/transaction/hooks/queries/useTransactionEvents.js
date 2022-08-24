import { EVENTS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

/**
 * Creates a custom hook for transaction event list query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} [configuration.config.params.height] - filter events by a given height
 * @param {string} [configuration.config.params.transactionID] - filter events by transaction ID
 * @param {string} [configuration.config.params.blockID] - filter events by block ID
 * @param {string} [configuration.config.params.senderAddress] -filter event by sender's address
 * @param {string} [configuration.config.params.timestamp] -filter event by timestamp
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useTransactionEvents = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/events`,
    method: 'get',
    event: 'get.events',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  const keys = [EVENTS, APPLICATION, METHOD, config];

  return useCustomInfiniteQuery({ config, options, keys });
};
