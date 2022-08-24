import { BLOCKS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

/**
 * Creates a custom hook for block queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {Object} configuration.config - the query config
 * @param {Object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} [configuration.config.params.blockID] - block ID
 * @param {string} [configuration.config.params.height] - block height
 * @param {string} [configuration.config.params.timestamp] - block timestamp
 * @param {string} [configuration.config.params.generatorAddress] - block generator address
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useBlocks = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/blocks`,
    method: 'get',
    event: 'get.blocks',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  const keys = [BLOCKS, APPLICATION, METHOD, config];

  return useCustomInfiniteQuery({ config, options, keys });
};
