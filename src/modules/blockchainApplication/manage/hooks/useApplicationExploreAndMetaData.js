import { useMemo } from 'react';
import client from 'src/utils/api/client';
import { useBlockchainApplicationExplore } from '../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';

const extractAppMetaDataToChainIds = (applicationsMetaData) =>
  applicationsMetaData.map(({ chainID }) => chainID).join(',');

export const useApplicationExploreAndMetaData = ({ isDefault = true, network = 'mainnet' }) => {
  const {
    data: { data: applicationsMetadata = [] } = {},
    isFetched: isFetchedAppsMetaData,
    isLoading: isLoadingAppsMetaData,
    error: errorGettingAppsMetaData,
  } = useBlockchainApplicationMeta({
    config: { params: { isDefault, network } },
    options: { enabled: !!client },
  });

  const {
    data: { data: applications = [] } = {},
    isLoading: isLoadingActiveApps,
    error: errorGettingActiveApps,
    isFetched: isFetchedActiveApps,
  } = useBlockchainApplicationExplore(
    { config: { params: { chainID: extractAppMetaDataToChainIds(applicationsMetadata) } } },
    { enabled: isFetchedAppsMetaData && applicationsMetadata.length !== 0 }
  );

  const mergedApplications = useMemo(() => {
    if (!applicationsMetadata?.length || !applications?.length) return 0;

    return applicationsMetadata.map(({ chainID, ...restApplication }) => ({
      ...restApplication,
      ...applications.find((app) => app.chainID === chainID),
    }));
  }, [applicationsMetadata, applications]);

  return {
    applications: mergedApplications,
    isLoading: isLoadingActiveApps || isLoadingAppsMetaData,
    error: errorGettingActiveApps || errorGettingAppsMetaData,
    isFetched: isFetchedActiveApps && isFetchedAppsMetaData
  };
};
