import { useCustomQuery } from 'src/modules/common/hooks';
import { API_VERSION } from 'src/const/config';
import { INVOKE } from 'src/const/queries';

/**
 * Proxy invoke endpoint to blockchain application client
 * @returns
 */
export const useInvokeQuery = ({ config: customConfig = {}, options }) => {
  const config = {
    url: `/api/${API_VERSION}/invoke`,
    method: 'post',
    event: 'post.invoke',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [INVOKE],
    config,
    options,
  });
};
