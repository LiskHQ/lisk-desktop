/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query';
import { COMMAND_PARAMETERS_SCHEMAS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

/**
 * Creates a custom hook for command parameters schemas queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {Object} configuration.config - the query config
 * @param {Object} configuration.config.params - the query config params
 * @param {string} [configuration.config.params.moduleCommandID] - the transaction type
 * @param {string} [configuration.config.params.moduleCommandName] - the transaction name
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useCommandParametersSchemas = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/commands/parameters/schemas`,
    method: 'get',
    event: 'get.commands.parameters.schemas',
    ...customConfig,
    params: { ...customConfig.params },
  };
  return useQuery(
    [COMMAND_PARAMETERS_SCHEMAS, APPLICATION, METHOD, config],
    async () => API_METHOD[METHOD]({
      ...config,
      params: {
        ...(config.params || {}),
      },
    }),
    {
      ...options,
    },
  );
};
