/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useTransactionUpdate } from '@transaction/hooks';
import useSettings from '@settings/hooks/useSettings';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { useNetworkStatus, useIndexStatus } from '@network/hooks/queries';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { useCurrentAccount } from 'src/modules/account/hooks';
import { Client } from 'src/utils/api/client';
import { useReduxStateModifier } from 'src/utils/useReduxStateModifier';
import { useLedgerDeviceListener } from '@libs/hardwareWallet/ledger/ledgerDeviceListener/useLedgerDeviceListener';
import { useValidServiceUrl } from '@blockchainApplication/manage/hooks/useValidServiceUrl';
import { useRewardsClaimable } from 'src/modules/pos/reward/hooks/queries';

export const ApplicationBootstrapContext = createContext({
  hasNetworkError: false,
  isLoadingNetwork: false,
  error: {},
  refetchNetwork: () => {},
  appEvents: { transactions: { rewards: {} } },
});

const ApplicationBootstrap = ({ children }) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);
  const [currentApplication, setCurrentApplication] = useCurrentApplication();
  const { setApplications } = useApplicationManagement();
  const [currentAccount] = useCurrentAccount();
  const accountAddress = currentAccount?.metadata?.address;
  const queryClient = useRef();

  queryClient.current = new Client({ http: mainChainNetwork?.serviceUrl });

  useTransactionUpdate();
  const networkStatus = useNetworkStatus({
    options: { enabled: !!mainChainNetwork },
    client: queryClient.current,
  });
  const indexStatus = useIndexStatus({
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

  const serviceUrls = blockchainAppsMeta.data?.data[0]?.serviceURLs;
  const { validServiceUrl } = useValidServiceUrl(serviceUrls);

  const mainChainApplication = blockchainAppsMeta.data?.data?.find(
    ({ chainID }) => chainID === networkStatus?.data?.data?.chainID
  );

  const isError =
    ((networkStatus.isError && !networkStatus.data) || blockchainAppsMeta.isError) &&
    !!mainChainNetwork;

  useEffect(() => {
    if (mainChainApplication && validServiceUrl) {
      const refreshedCurrentApplication = blockchainAppsMeta?.data?.data?.find(
        ({ chainID }) => chainID === currentApplication?.chainID
      );
      const networkCode = mainChainApplication.chainID.match(/^\d{4}/g)[0];
      const currentAppToSelect =
        refreshedCurrentApplication?.chainID?.indexOf(networkCode) === 0
          ? refreshedCurrentApplication
          : mainChainApplication;

      const currentApplicationWithValidServiceUrlAtTheTop = {
        ...currentAppToSelect,
        serviceURLs: currentAppToSelect.serviceURLs.sort((a, b) => {
          const nameA = a.http === validServiceUrl;
          const nameB = b.http === validServiceUrl;
          if (nameA && nameB) {
            return 0;
          }
          if (nameA) {
            return -1;
          }
          return 1;
        }),
      };

      setCurrentApplication(currentApplicationWithValidServiceUrlAtTheTop);
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
    validServiceUrl,
  ]);

  useLedgerDeviceListener();
  useReduxStateModifier();
  const { data: rewardsData } = useRewardsClaimable({
    config: { params: { address: accountAddress } },
    options: { enabled: !!accountAddress, refetchInterval: 300000 },
  });

  return (
    <ApplicationBootstrapContext.Provider
      value={{
        hasNetworkError: isError && !blockchainAppsMeta.isFetching,
        isLoadingNetwork:
          (blockchainAppsMeta.isFetching && !blockchainAppsMeta.data) ||
          (networkStatus.isFetching && !networkStatus.data),
        indexStatus: indexStatus?.data?.data || {},
        error: networkStatus.error || blockchainAppsMeta.error,
        refetchNetwork: blockchainAppsMeta.refetch,
        appEvents: { transactions: { rewards: rewardsData?.data ?? [] } },
      }}
    >
      {children}
    </ApplicationBootstrapContext.Provider>
  );
};

export default ApplicationBootstrap;
