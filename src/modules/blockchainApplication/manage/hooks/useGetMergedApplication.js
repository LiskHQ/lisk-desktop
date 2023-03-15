/* eslint-disable max-statements */
import { useEffect, useMemo } from 'react';
import { metaDataClient } from 'src/utils/api/client';
import networks from 'src/modules/network/configuration/networks';
import { useBlockchainApplicationExplore } from '../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';

const extractAppMetaDataToChainIds = (applicationsMetaData) =>
  applicationsMetaData.map(({ chainID }) => chainID).join(',');

export const useGetMergedApplication = ({ params, networkName, isEnabled }) => {
  const {
    data: { data: applicationsMetadata = [] } = {},
    isFetched: isFetchedAppsMetaData,
    isLoading: isLoadingAppsMetaData,
    error: errorGettingAppsMetaData,
    refetch: refetchAppsMetaData,
  } = useBlockchainApplicationMeta({
    config: { params: { chainID: params.chainID, network: networkName } },
    client: metaDataClient,
    options: { enabled: isEnabled },
  });

  const isBlockchainExporeEnabled =
    isFetchedAppsMetaData && applicationsMetadata.length !== 0 && isEnabled;

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
    options: { enabled: isBlockchainExporeEnabled },
  });

  const hasError =
    !!errorGettingActiveApps || !!errorGettingAppsMetaData || !applicationsMetadata.length;

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
    if (networks[networkName]) {
      metaDataClient.create({
        http: networks[networkName].serviceUrl,
        ws: networks[networkName].wsServiceUrl,
      });
    }
  }, []);

  return {
    retry,
    data: mergedApplications[0],
    isLoading: (isLoadingActiveApps && isBlockchainExporeEnabled) || isLoadingAppsMetaData,
    isError: hasError,
    isFetched: isFetchedActiveApps && isFetchedAppsMetaData,
    refetch: retry,
  };
};
