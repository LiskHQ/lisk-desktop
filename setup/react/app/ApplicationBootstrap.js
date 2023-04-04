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
import { PrimaryButton } from 'src/theme/buttons';
import { useLedgerDeviceListener } from '@libs/hardwareWallet/ledger/ledgerDeviceListener/useLedgerDeviceListener';

const ApplicationBootstrap = ({ children }) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);
  const [currentApplication, setCurrentApplication] = useCurrentApplication();
  const { setApplications } = useApplicationManagement();
  const queryClient = useRef(new Client({ http: mainChainNetwork?.serviceUrl }));
  useTransactionUpdate();

  const networkStatus = useNetworkStatus({
    options: { enabled: !!mainChainNetwork && isFirstTimeLoading },
    client: queryClient.current,
  });

  const blockchainAppsMeta = useBlockchainApplicationMeta({
    config: {
      params: {
        chainID: [
          ...new Set([networkStatus?.data?.data?.chainID, currentApplication.chainID]),
        ]?.filter(item => item).join(','),
        network: mainChainNetwork?.name,
      },
    },
    options: { enabled: !!networkStatus.data && !!mainChainNetwork && isFirstTimeLoading },
    client: queryClient.current,
  });

  const mainChainApplication = blockchainAppsMeta?.data?.data?.find(
    ({ chainID }) => chainID === networkStatus?.data?.data?.chainID
  );

  const isError = (networkStatus.isError || blockchainAppsMeta.isError) && !!mainChainNetwork;
  const isLoading =
    (networkStatus.isLoading && !!mainChainNetwork) ||
    (blockchainAppsMeta.isLoading && !!mainChainApplication);

  useEffect(() => {
    if (isFirstTimeLoading && mainChainApplication) {
      const refreshedCurrentApplication = blockchainAppsMeta?.data?.data?.find(
        ({ chainID }) => chainID === currentApplication?.chainID
      );
      setCurrentApplication(refreshedCurrentApplication || mainChainApplication);
      setApplications(blockchainAppsMeta?.data?.data || []);
    }
    if (isFirstTimeLoading && blockchainAppsMeta.isFetched) setIsFirstTimeLoading(false);
  }, [mainChainApplication, isFirstTimeLoading]);

  useLedgerDeviceListener();

  if (isError && !isLoading && isFirstTimeLoading) {
    // @TODO: this return should be replaced with an actual error message page
    return (
      <div>
        error
        <PrimaryButton onClick={blockchainAppsMeta.refetch}>Retry</PrimaryButton>
      </div>
    );
  }

  return !isLoading || !isFirstTimeLoading ? children : null;
};

export default ApplicationBootstrap;
