import { LEGACY } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for legacy account queries
 */
export const useLegacy = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/legacy`,
    method: 'get',
    event: 'get.legacy',
    ...customConfig,
    params: { publicKey: '', ...customConfig.params },
  };
  return useCustomQuery({
    keys: [LEGACY],
    config,
    options,
  });
};
