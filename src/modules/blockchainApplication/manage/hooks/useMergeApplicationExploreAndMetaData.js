import lodashMerge from 'lodash.merge';
import useSettings from '@settings/hooks/useSettings';
import { Client } from 'src/utils/api/client';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';

const useMergeApplicationExploreAndMetaData = (appOnChainData = []) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const chainIDs = appOnChainData.map((data) => data.chainID).join(',');
  const { data: { data: appMetaData = [] } = {}, isLoading } = useBlockchainApplicationMeta({
    config: { params: { chainID: chainIDs } },
    options: { enabled: !!chainIDs?.length },
    client: new Client({ http: mainChainNetwork?.serviceUrl }),
  });

  const filteredOnChainData = appOnChainData.filter(({ chainID }) =>
    appMetaData.some(({ chainID: metaDataChainId }) => metaDataChainId === chainID)
  );

  return isLoading ? filteredOnChainData : lodashMerge(filteredOnChainData, appMetaData);
};

export default useMergeApplicationExploreAndMetaData;
