import { useQuery } from '@tanstack/react-query';
import { FEES, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

/**
 * Creates a custom hook for transaction fees query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query parameters
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useFees = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/fees`,
    method: 'get',
    event: 'get.fees',
    ...customConfig,
  };
  return useQuery(
    [FEES, APPLICATION, METHOD, config],
    async () => API_METHOD[METHOD](config),
    {
      ...options,
    },
  );
};
