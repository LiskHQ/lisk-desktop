import { TRANSACTIONS_FEES } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for transaction fees query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.data - the body parameters
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useTransactionEstimateFees = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/transaction/estimate-fees`,
    method: 'post',
    event: 'post.transactions.estimate-fees',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [TRANSACTIONS_FEES],
    config,
    options,
  });
};
