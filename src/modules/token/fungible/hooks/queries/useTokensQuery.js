import { API_VERSION, LIMIT } from "src/const/config";
import { GET_ACCOUNT_TOKENS_QUERY } from "src/const/queries";
import { useCurrentAccount } from "src/modules/account/hooks";
import defaultClient from 'src/utils/api/client';
import { useCustomInfiniteQuery } from "src/modules/common/hooks";
import { useQueryKeys } from "src/modules/common/hooks/useQueryKeys";

export function useAccountTokensQueryParams({ config: customConfig = {} } = {}) {
  const [currentAccount] = useCurrentAccount();

  const config = {
    url: `/api/${API_VERSION}/tokens`,
    method: 'get',
    event: 'get.tokens',
    ...customConfig,
    params: {
      address: currentAccount.metadata?.address,
      limit: LIMIT,
      ...(customConfig?.params || {}),
    },
  };

  const keys = useQueryKeys([GET_ACCOUNT_TOKENS_QUERY, currentAccount.metadata?.address, config]);

  return { config, keys };
}

/**
 * Fetch list of tokens available for a given user account.
 * Executes the API call once the hook is mounted.
 * @param {Object} config - Custom configurations for the query.
 * @param {Object} options - Custom options for the query.
 * @param {Object} client - Custom API client for the query.
 * @returns - The query state of the API call. Includes the data
 * (tokens), loading state, error state, and more.
 */
export function useTokensQuery({
  config: customConfig = {},
  options = {},
  client = defaultClient,
} = {}) {
  const { config, keys } = useAccountTokensQueryParams({ config: customConfig });

  return useCustomInfiniteQuery({ config, options, keys, client });
}
