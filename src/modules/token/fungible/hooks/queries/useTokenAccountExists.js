/* istanbul ignore file */
import { useCustomQuery } from 'src/modules/common/hooks';
import { API_VERSION } from 'src/const/config';
import { TOKENS_ACCOUNT_EXISTS } from 'src/const/queries';

export const useTokenAccountExists = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/token/account/exists`,
    method: 'get',
    event: 'get.token.account.exists',
    ...customConfig,
    params: { ...customConfig.params },
  };
  return useCustomQuery({ keys: [TOKENS_ACCOUNT_EXISTS], config, options });
};
