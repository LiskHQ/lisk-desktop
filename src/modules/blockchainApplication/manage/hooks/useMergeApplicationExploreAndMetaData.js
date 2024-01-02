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

  return isLoading
    ? filteredOnChainData
    : (() => {
        const appsWithMetadata = appOnChainData.filter(({ chainID }) =>
          appMetaData.some(({ chainID: metaDataChainId }) => metaDataChainId === chainID)
        );

        const appsWithoutMetadata = appOnChainData.filter(
          ({ chainID }) =>
            !appMetaData.some(({ chainID: metaDataChainId }) => metaDataChainId === chainID)
        );

        const appsWithMetadataMerged = appsWithMetadata.map((onChainData) => {
          const metadata = appMetaData.find(
            ({ chainID: metaDataChainId }) => metaDataChainId === onChainData.chainID
          );
          return lodashMerge(metadata, onChainData);
        });

        return appsWithMetadataMerged.concat(appsWithoutMetadata);
      })();
};

export default useMergeApplicationExploreAndMetaData;
