import { useMemo } from 'react';
import { Client } from 'src/utils/api/client';
import { useNetworkStatus } from '@network/hooks/queries';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { useDebounce } from 'src/modules/search/hooks/useDebounce';
import axios from "axios";

export const DEFAULT_NETWORK_FORM_STATE = {
  name: '',
  serviceUrl: '',
  wsServiceUrl: '',
};

export function getDuplicateNetworkFields(newNetwork, networks, networkToExclude) {
  if (!newNetwork || !networks) {
    return undefined;
  }

  const newNetworkValues = Object.values(newNetwork);

  const result = networks.reduce((accumResult, network) => {
    const excluded = network.name === networkToExclude;
    if (excluded) {
      return accumResult;
    }

    const duplicateFields = Object.entries(network).reduce((accum, [key, value]) => {
      if (
        newNetworkValues.includes(value) &&
        Object.keys(DEFAULT_NETWORK_FORM_STATE).includes(key)
      ) {
        const safeSpread = accum || {};

        return {
          ...safeSpread,
          [key]: value,
        };
      }

      return accum;
    }, {});

    return (
      (accumResult || duplicateFields) && {
        ...accumResult,
        ...duplicateFields,
      }
    );
  }, {});

  return Object.keys(result).length > 0 ? result : undefined;
}

export async function isNetworkUrlSuccess(url) {
  try {
    await axios({ url, timeout: 4000 });
    return true;
  } catch (error) {
    return false;
  }
}

export async function getHasValidServiceUrl(serviceURLs) {
  console.log('serviceURLs', serviceURLs);
  if(!serviceURLs) {
    return false;
  }
  const promises = [];
  for (let i = 0; i < serviceURLs.length; i++) {
    promises.push(isNetworkUrlSuccess(serviceURLs[i]?.http));
  }
  const responses = await Promise.all(promises);
  console.log('getHasValidServiceUrl responses', responses);
  const hasValidServiceUrl = responses.find((response) => response)
  return hasValidServiceUrl;
}

/* istanbul ignore next */
export async function useNetworkCheck(serviceUrl) {
  serviceUrl = useDebounce(serviceUrl, 300);
  const client = useMemo(() => serviceUrl && new Client({ http: serviceUrl }), [serviceUrl]);

  const networkStatus = useNetworkStatus({
    options: { enabled: !!serviceUrl, retry: false },
    client,
  });
  console.log('useNetworkCheck networkStatus', networkStatus);

  const blockchainAppsMeta = useBlockchainApplicationMeta({
    config: {
      params: {
        chainID: [...new Set([networkStatus?.data?.data?.chainID])]
          .filter((item) => item)
          .join(','),
      },
    },
    options: { enabled: !!networkStatus?.data?.data, retry: false },
    client,
  });

  const serviceUrls = blockchainAppsMeta.data?.data[0]?.serviceURLs;
  const hasValid = await getHasValidServiceUrl(serviceUrls);
  console.log('hasValid', hasValid);

  console.log('useNetworkCheck blockchainAppsMeta', blockchainAppsMeta);

  const handleRefetch = () => {
    networkStatus.refetch();
    blockchainAppsMeta.refetch();
  };

  return {
    isNetworkOK: !!networkStatus?.data?.data && !!blockchainAppsMeta?.data?.data,
    isOnchainOK: !!networkStatus?.data?.data,
    isOffchainOK: !!blockchainAppsMeta?.data?.data,
    isFetching: networkStatus?.isFetching || blockchainAppsMeta?.isFetching,
    isError: networkStatus?.isError || blockchainAppsMeta?.isError,
    refetch: handleRefetch,
  };
}
