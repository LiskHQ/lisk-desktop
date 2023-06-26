import { DRY_RUN } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for transaction dry run
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query parameters
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useDryRun = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/transactions/dryrun`,
    method: 'post',
    event: 'post.dryrun',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [DRY_RUN],
    config,
    options,
  });
};
