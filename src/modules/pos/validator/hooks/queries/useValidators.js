import { VALIDATORS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for validators queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.address] - Validator sender
 * @param {string} [configuration.config.params.name] - Validator name
 * @param {string} [configuration.config.params.status] - Validator status
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useValidators = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/pos/validators`,
    method: 'get',
    event: 'get.pos.validators',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    keys: [VALIDATORS],
    config,
    options,
  });
};
