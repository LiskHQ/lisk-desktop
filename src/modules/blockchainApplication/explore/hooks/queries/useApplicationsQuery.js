// import { useCustomInfiniteQuery } from 'utilities/api/hooks/useCustomInfiniteQuery';
import { GET_APPLICATION_QUERY } from 'src/const/queries';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import { LIMIT, API_URL, API_BASE_URL } from 'src/utils/api/constants';

/**
 * Fetch list of blockchain applications on-chain data.
 * Executes the API call once the hook is mounted.
 * @param {Object} config - Custom configurations for the query.
 * @param {Object} options - Custom options for the query.
 * @returns - The query state of the API call. Includes the data
 * (applications), loading state, error state, and more.
 */
export default function useApplicationsQuery(chainID, { config: customConfig = {}, options = {} } = {}) {
  const config = {
    baseURL: API_BASE_URL,
    url: `${API_URL}/blockchain/apps`,
    method: 'get',
    event: 'get.blockchain.apps',
    ...customConfig,
    params: { chainID, limit: LIMIT, ...customConfig.params },
  };

  const keys = [GET_APPLICATION_QUERY];

  return useCustomInfiniteQuery({ config, options, keys });
}
