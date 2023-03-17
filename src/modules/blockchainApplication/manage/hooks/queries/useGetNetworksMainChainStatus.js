import { Client } from 'src/utils/api/client';
import { useCustomQuery } from 'src/modules/common/hooks';
import { API_VERSION } from 'src/const/config';
import { MAIN_CHAIN_APPLICATIONS_BY_NETWORKS } from 'src/const/queries';
import useSettings from 'src/modules/settings/hooks/useSettings';

export const useGetNetworksMainChainStatus = ({ options } = {}) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');

  const commonConfig = {
    url: `/api/${API_VERSION}/network/status`,
    method: 'get',
  };

  // const networksToQuery = { ...networks };
  // delete networksToQuery[networkKeys.customNode];

  // const queryClients = Object.values(networksToQuery).map(
  //   ({ serviceUrl }) => new Client({ http: serviceUrl })
  // );
  // const combinedQueryFn = () =>
  //   Promise.all(
  //     queryClients.map((client) => client.call(commonConfig).catch(() => Promise.resolve(null)))
  //   );

  const response = useCustomQuery({
    keys: [MAIN_CHAIN_APPLICATIONS_BY_NETWORKS],
    config: commonConfig,
    client: new Client({ http: mainChainNetwork.serviceUrl }),
    options: { ...options, enabled: !!mainChainNetwork },
  });

  return response;
};
