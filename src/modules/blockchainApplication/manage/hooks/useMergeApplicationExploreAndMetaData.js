import lodashMerge from 'lodash.merge';
import useSettings from '@settings/hooks/useSettings';
import { Client } from 'src/utils/api/client';
import { useBlockchainApplicationMeta } from './queries/useBlockchainApplicationMeta';

const useMergeApplicationExploreAndMetaData = (appOnChainData = [], isUnion = false) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const chainIDs = appOnChainData.map((data) => data.chainID).join(',');
  const { data: { data: appMetaData = [] } = {}, isLoading } = useBlockchainApplicationMeta({
    config: { params: { chainID: chainIDs } },
    options: { enabled: !!chainIDs?.length },
    client: new Client({ http: mainChainNetwork?.serviceUrl }),
  });

  const filteredOnChainData = isUnion
    ? appOnChainData
    : appOnChainData.filter(({ chainID }) =>
        appMetaData.some(({ chainID: metaDataChainId }) => metaDataChainId === chainID)
      );

  const mergeOnChainOffChainData = () => {
    const appsWithMetaData = appOnChainData.filter(({ chainID }) =>
      appMetaData.some(({ chainID: metaDataChainId }) => metaDataChainId === chainID)
    );

    const appsWithoutMetaData = appOnChainData.filter(
      ({ chainID }) =>
        !appMetaData.some(({ chainID: metaDataChainId }) => metaDataChainId === chainID)
    );

    const appsWithMetaDataMerged = appsWithMetaData.map((onChainData) => {
      const metadata = appMetaData.find(
        ({ chainID: metaDataChainId }) => metaDataChainId === onChainData.chainID
      );
      return lodashMerge(metadata, onChainData);
    });

    return appsWithMetaDataMerged.concat(appsWithoutMetaData);
  };

  return isLoading ? filteredOnChainData : mergeOnChainOffChainData();
};

export default useMergeApplicationExploreAndMetaData;
