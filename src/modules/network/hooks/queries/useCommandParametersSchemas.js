/* istanbul ignore file */
import { COMMAND_PARAMETERS_SCHEMAS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

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
