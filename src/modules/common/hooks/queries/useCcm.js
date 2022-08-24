import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { CCM, APPLICATION } from 'src/const/queries';
import { useCustomInfiniteQuery } from './useCustomInfiniteQuery';

/**
 * Creates a custom hook for ccm queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} [configuration.config.params.id] - CCM ID
 * @param {string} [configuration.config.params.transactionID] - CCM transactionID
 * @param {string} [configuration.config.params.moduleCrossChainCommandID] - CCM transaction type
 * @param {string} [configuration.config.params.moduleCrossChainCommandName] - CCM transaction name
 * @param {string} [configuration.config.params.senderAddress] - CCM sender
 * @param {string} [configuration.config.params.status] - CCM status
 * @param {string} [configuration.config.params.timestamp] - CCM timestamp
 * @param {string} [configuration.config.params.nonce] - CCM nonce used with sender address
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useCcm = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/ccm`,
    method: 'get',
    event: 'get.ccm',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const keys = [CCM, APPLICATION, METHOD, config];
  return useCustomInfiniteQuery({
    keys,
    config,
    options,
  });
};
