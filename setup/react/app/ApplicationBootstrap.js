/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { useEffect, useRef, useState } from 'react';
import { useTransactionUpdate } from '@transaction/hooks';
import useSettings from '@settings/hooks/useSettings';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { useNetworkStatus } from '@network/hooks/queries';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { Client } from 'src/utils/api/client';
import { useLedgerDeviceListener } from '@libs/hardwareWallet/ledger/ledgerDeviceListener/useLedgerDeviceListener';
import NetworkError from 'src/modules/common/components/NetworkError/NetworkError';

const ApplicationBootstrap = ({ children }) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);
  const [currentApplication, setCurrentApplication] = useCurrentApplication();
  const { setApplications } = useApplicationManagement();
  const queryClient = useRef(new Client({ http: mainChainNetwork?.serviceUrl }));
  useTransactionUpdate();

  const networkStatus = useNetworkStatus({
    options: { enabled: !!mainChainNetwork },
    client: queryClient.current,
  });

  const blockchainAppsMeta = useBlockchainApplicationMeta({
    config: {
      params: {
        chainID: [...new Set([networkStatus.data?.data?.chainID, currentApplication.chainID])]
          .filter((item) => item)
          .join(','),
      },
    },
    options: { enabled: !!networkStatus.data && !!mainChainNetwork },
    client: queryClient.current,
  });

  const mainChainApplication = blockchainAppsMeta?.data?.data?.find(
    ({ chainID }) => chainID === networkStatus?.data?.data?.chainID
  );

  const isError = (networkStatus.isError || blockchainAppsMeta.isError) && !!mainChainNetwork;

  useEffect(() => {
    if (mainChainApplication) {
      const refreshedCurrentApplication = blockchainAppsMeta?.data?.data?.find(
        ({ chainID }) => chainID === currentApplication?.chainID
      );
      setCurrentApplication(refreshedCurrentApplication || mainChainApplication);
      setApplications([blockchainAppsMeta?.data?.data[0]]);
    }
    if (isFirstTimeLoading && blockchainAppsMeta.isFetched && !blockchainAppsMeta.isError) {
      setIsFirstTimeLoading(false);
    }
  }, [mainChainApplication?.chainID, blockchainAppsMeta?.isFetched]);

  useLedgerDeviceListener();

  if (isError && !blockchainAppsMeta.isFetching && isFirstTimeLoading) {
    const error = networkStatus.error || blockchainAppsMeta.error;
    const errorMessage = {
      message: error.message,
      endpoint: `${error.config.baseURL}${error.config.url}`,
      requestPayload: error.request.data,
      method: error.config.method,
      requestHeaders: error.config.headers,
      responsePayload: error.response.data,
      responseStatusCode: error.response.status,
      responseStatusText: error.response.statusText,
    };

    return (
      <NetworkError
        onRetry={blockchainAppsMeta.refetch}
        errorMessage={JSON.stringify(errorMessage)}
      />
    );
  }

  return isFirstTimeLoading ? null : children;
};

export default ApplicationBootstrap;
