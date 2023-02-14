import { useBlockchainApplicationExplore } from '../../explore/hooks/queries/useBlockchainApplicationExplore';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';

export const useApplicationExploreAndMetaData = ({ appState = 'active' } = {}) => {
  const {
    data: { data: activeApps = [] } = {},
    isLoading: isLoadingActiveApps,
    error: errorGettingActiveApps,
  } = useBlockchainApplicationExplore({ config: { params: { state: appState } } });

  const activeAppsList = activeApps.map((app) => app.chainID).join();

  const {
    data: { data: applications = [] } = {},
    isLoading: isLoadingAppsMetaData,
    error: errorGettingAppsMetaData,
  } = useBlockchainApplicationMeta({
    config: { params: { chainID: activeAppsList } },
    options: { enabled: !isLoadingActiveApps && !errorGettingActiveApps },
  });

  return {
    applications,
    isLoading: isLoadingActiveApps || isLoadingAppsMetaData,
    error: errorGettingActiveApps || errorGettingAppsMetaData,
  };
};
