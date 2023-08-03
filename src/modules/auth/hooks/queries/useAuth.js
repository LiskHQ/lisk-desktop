import { AUTH } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for command parameters schemas queries
 */
export const useAuthConfig = (config) => ({
  url: `/api/${API_VERSION}/auth`,
  method: 'get',
  event: 'get.auth',
  ...config,
});

export const useAuth = ({ config: customConfig = {}, options } = {}) => {
  const config = useAuthConfig(customConfig);
  return useCustomQuery({
    keys: [AUTH],
    config,
    options,
  });
};
