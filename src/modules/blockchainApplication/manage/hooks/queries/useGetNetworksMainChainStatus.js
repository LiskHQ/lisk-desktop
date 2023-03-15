import { Client } from 'src/utils/api/client';
import networks, { networkKeys } from 'src/modules/network/configuration/networks';
import { useCustomQuery } from 'src/modules/common/hooks';
import { API_VERSION } from 'src/const/config';
import { MAIN_CHAIN_APPLICATIONS_BY_NETWORKS } from 'src/const/queries';

export const useGetNetworksMainChainStatus = ({ options } = {}) => {
  const commonConfig = {
    url: `/api/${API_VERSION}/network/status`,
    method: 'get',
  };

  const networksToQuery = { ...networks };
  delete networksToQuery[networkKeys.customNode];

  const queryClients = Object.values(networksToQuery).map(
    ({ serviceUrl }) => new Client({ http: serviceUrl })
  );
  const combinedQueryFn = () =>
    Promise.all(
      queryClients.map((client) => client.call(commonConfig).catch(() => Promise.resolve(null)))
    );

  const response = useCustomQuery({
    keys: [MAIN_CHAIN_APPLICATIONS_BY_NETWORKS],
    config: commonConfig,
    queryFn: combinedQueryFn,
    options,
  });
  const networkMainChainStatuses = response?.data || [];

  const data = Object.keys(networksToQuery).reduce((result, networkName, index) => {
    result[networkName] = networkMainChainStatuses[index];
    return result;
  }, {});

  return { ...response, data };
};
