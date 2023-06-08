/* eslint-disable complexity */
/* eslint-disable max-statements */
import { useEffect, useRef, useState } from 'react';
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

const ApplicationBootstrap = ({ children }) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);
  const [currentApplication, setCurrentApplication] = useCurrentApplication();
  const { setApplications } = useApplicationManagement();
  const queryClient = useRef();

  queryClient.current = new Client({ http: mainChainNetwork?.serviceUrl });

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

  const mainChainApplication = blockchainAppsMeta.data?.data?.find(
    ({ chainID }) => chainID === networkStatus?.data?.data?.chainID
  );

  const isError =
    ((networkStatus.isError && !networkStatus.data) || blockchainAppsMeta.isError) &&
    !!mainChainNetwork;

  useEffect(() => {
    if (mainChainApplication) {
      const refreshedCurrentApplication = blockchainAppsMeta?.data?.data?.find(
        ({ chainID }) => chainID === currentApplication?.chainID
      );
      const networkCode = mainChainApplication.chainID.match(/^\d{4}/g)[0];
      const currentAppToSet =
        refreshedCurrentApplication?.chainID?.indexOf(networkCode) === 0
          ? refreshedCurrentApplication
          : mainChainApplication;

      setCurrentApplication(currentAppToSet);
      setApplications([mainChainApplication]);
    }

    if (isFirstTimeLoading && blockchainAppsMeta.isFetched && !blockchainAppsMeta.isError) {
      setIsFirstTimeLoading(false);
    }
  }, [
    mainChainNetwork,
    blockchainAppsMeta.isFetched,
    blockchainAppsMeta.isError,
    blockchainAppsMeta.isLoading,
  ]);

  useLedgerDeviceListener();

  return children({
    hasNetworkError: isError && !blockchainAppsMeta.isFetching,
    isLoadingNetwork: blockchainAppsMeta.isFetching || networkStatus.isFetching,
    error: networkStatus.error || blockchainAppsMeta.error,
    refetchNetwork: blockchainAppsMeta.refetch,
  });
};

export default ApplicationBootstrap;
