import { useInvokeQuery } from 'src/modules/common/hooks';

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
export const useTransactionsFromPool = ({ options = {}, address, customConfig = {} } = {}) => {
  const config = {
    data: {
      endpoint: 'txpool_getTransactionsFromPool',
      params: { address },
    },
    ...customConfig,
  };

  const result = useInvokeQuery({
    config,
    options: { ...options, enabled: !!address && options?.enabled !== false },
  });

  return result;
};
