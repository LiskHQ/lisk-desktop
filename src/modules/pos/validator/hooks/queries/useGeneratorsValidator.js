import { VALIDATOR } from 'src/const/queries';
import {
  API_VERSION,
} from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for block validator queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} configuration.config.params.address - account address
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useGeneratorsValidator = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/validator`,
    method: 'get',
    event: 'get.validator',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [VALIDATOR],
    config,
    options,
  });
};
