/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query';
import { COMMAND_PARAMETERS_SCHEMAS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

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
