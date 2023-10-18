import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Client } from 'src/utils/api/client';
import { useNetworkStatus } from '@network/hooks/queries';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { useDebounce } from 'src/modules/search/hooks/useDebounce';
import { isEmpty } from 'src/utils/helpers';

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

export async function isNetworkUrlSuccess(fetchUrl, successBaseUrlToReturn) {
  try {
    await axios({ url: fetchUrl, timeout: 4000 });
    return successBaseUrlToReturn;
  } catch (error) {
    return false;
  }
}

export function useValidServiceUrl(serviceURLs) {
  const [validServiceUrl, setValidServiceUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!isEmpty(serviceURLs)) {
        setIsLoading(true);
        const promises = [];
        for (let i = 0; i < serviceURLs.length; i++) {
          const baseServiceUrl = serviceURLs[i]?.http;
          promises.push(
            isNetworkUrlSuccess(`${baseServiceUrl}/api/v3/index/status`, baseServiceUrl)
          );
        }
        const responses = await Promise.all(promises);
        const serviceUrl = responses.find((response) => response);
        setValidServiceUrl(serviceUrl);
        setIsLoading(false);
      }
    })();
  }, [serviceURLs]);

  return { validServiceUrl, isLoading };
}

/* istanbul ignore next */
export function useNetworkCheck(serviceUrl) {
  serviceUrl = useDebounce(serviceUrl, 300);
  const client = useMemo(() => serviceUrl && new Client({ http: serviceUrl }), [serviceUrl]);

  const networkStatus = useNetworkStatus({
    options: { enabled: !!serviceUrl, retry: false },
    client,
  });

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
  const { validServiceUrl, isLoading } = useValidServiceUrl(serviceUrls);
  const hasValidServiceUrl = !!validServiceUrl;

  const handleRefetch = () => {
    networkStatus.refetch();
    blockchainAppsMeta.refetch();
  };

  return {
    isNetworkOK:
      !!networkStatus?.data?.data && !!blockchainAppsMeta?.data?.data && hasValidServiceUrl,
    isOnchainOK: !!networkStatus?.data?.data,
    isOffchainOK: !!blockchainAppsMeta?.data?.data,
    isFetching: networkStatus?.isFetching || blockchainAppsMeta?.isFetching || isLoading,
    isError: networkStatus?.isError || blockchainAppsMeta?.isError || !hasValidServiceUrl,
    refetch: handleRefetch,
  };
}
