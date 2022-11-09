/* istanbul ignore file */
import { COMMAND_PARAMETERS_SCHEMAS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for command parameters schemas queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {Object} configuration.config - the query config
 * @param {Object} configuration.config.params - the query config params
 * @param {string} [configuration.config.params.moduleCommandID] - the transaction type
 * @param {string} [configuration.config.params.moduleCommand] - the transaction name
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useCommandParametersSchemas = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/schemas`,
    method: 'get',
    event: 'get.schemas',
    ...customConfig,
    params: { ...customConfig.params },
  };
  return useCustomQuery({
    keys: [COMMAND_PARAMETERS_SCHEMAS],
    config,
    options,
  });
};
