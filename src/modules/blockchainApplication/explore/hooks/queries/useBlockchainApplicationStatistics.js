import { GET_APPLICATION_STATS } from "src/const/queries";
import { useCustomQuery } from "src/modules/common/hooks";
import { API_BASE_URL, API_URL } from "src/utils/api/constants";

export default function useBlockchainApplicationStatistics() {
  const query = useCustomQuery({
    keys: [GET_APPLICATION_STATS],
    config: {
      baseURL: API_BASE_URL,
      url: `${API_URL}/blockchain/apps/statistics`,
      method: 'get',
    },
  });

  return {
    ...query,
    data: query.data?.data ?? {},
  };
}
