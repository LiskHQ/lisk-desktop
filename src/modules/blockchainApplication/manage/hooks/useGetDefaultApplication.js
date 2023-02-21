/* eslint-disable max-statements */
import { useEffect, useMemo } from 'react';
import { getNetworkName } from '@network/utils/getNetwork';
import { useSelector } from 'react-redux';
import { metaDataClient } from 'src/utils/api/client';
import networks from 'src/modules/network/configuration/networks';
import { useBlockchainApplicationExplore } from '../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';

const extractAppMetaDataToChainIds = (applicationsMetaData) =>
  applicationsMetaData.map(({ chainID }) => chainID).join(',');

export const useGetDefaultApplication = () => {
  const network = useSelector((state) => state.network);
  const activeNetworkName = getNetworkName(network);

  const {
    data: { data: applicationsMetadata = [] } = {},
    isFetched: isFetchedAppsMetaData,
    isLoading: isLoadingAppsMetaData,
    error: errorGettingAppsMetaData,
    refetch: refetchAppsMetaData,
  } = useBlockchainApplicationMeta({
    config: { params: { isDefault: true, network } },
    client: metaDataClient,
  });

  const {
    data: { data: applications = [] } = {},
    isLoading: isLoadingActiveApps,
    error: errorGettingActiveApps,
    isFetched: isFetchedActiveApps,
    refetch: refetchApplications,
  } = useBlockchainApplicationExplore({
    config: {
      params: {
        chainID: extractAppMetaDataToChainIds(applicationsMetadata),
        limit: applicationsMetadata.length,
      },
    },
    client: metaDataClient,
    options: { enabled: isFetchedAppsMetaData && applicationsMetadata.length !== 0 },
  });

  const hasError = errorGettingActiveApps || errorGettingAppsMetaData;

  const mergedApplications = useMemo(() => {
    if (!applicationsMetadata?.length || hasError) return [];

    return applicationsMetadata.map(({ chainID, ...restApplication }) => ({
      chainID,
      ...restApplication,
      ...applications.find((app) => app.chainID === chainID),
    }));
  }, [applicationsMetadata, applications]);

  const retry = () => {
    if (hasError) {
      refetchAppsMetaData();
      refetchApplications();
    }
  };

  useEffect(() => {
    metaDataClient.create({
      http: networks[activeNetworkName].serviceUrl,
      ws: networks[activeNetworkName].wsServiceUrl,
    });
  }, []);

  return {
    retry,
    applications: mergedApplications,
    isLoading: isLoadingActiveApps || isLoadingAppsMetaData,
    error: errorGettingActiveApps || errorGettingAppsMetaData,
    isFetched: isFetchedActiveApps && isFetchedAppsMetaData,
  };
};
