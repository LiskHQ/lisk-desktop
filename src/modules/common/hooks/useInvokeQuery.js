
import { useQuery } from '@tanstack/react-query';
import defaultClient from 'src/utils/api/client';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';

/**
 * Creates a custom hook for invoking a method on Core
 *
 * @param {object} configuration - the custom query configuration object
 * @param {string[]} configuration.keys - the query keys
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.endpoint] - the WS endpoint to invoke
 * @param {number} [configuration.config.params.params] - params object to pass to the endpoint
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useInvokeQuery = ({
  keys,
  config = {},
  options = {},
  client = defaultClient
}) => {
  const [{ chainID }] = useCurrentApplication();
  const customConfig = {
    ...config,
    method: 'post.invoke',
    params: {
      ...config.params,
    },
  }

  return useQuery(
    [...keys, chainID, config],
    async () => client.socketRPC.emit(customConfig),
    options,
  );
};
