import { DELEGATES, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

/**
 * Creates a custom hook for delegates queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.address] - Delegate sender
 * @param {string} [configuration.config.params.name] - Delegate name
 * @param {string} [configuration.config.params.status] - Delegate status
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useDelegates = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/dpos/delegates`,
    method: 'get',
    event: 'get.dpos.delegates',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  const keys = [DELEGATES, APPLICATION, METHOD, config];

  return useCustomInfiniteQuery({ config, options, keys });
};
