/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { useEffect, useRef, useState } from 'react';
import { useTransactionUpdate } from '@transaction/hooks';
import useSettings from '@settings/hooks/useSettings';
// import { useGetMergedApplication } from '@blockchainApplication/manage/hooks/useGetMergedApplication';
import {
  useApplicationManagement,
  useCurrentApplication,
} from '@blockchainApplication/manage/hooks';
import { useNetworkStatus } from '@network/hooks/queries';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { Client } from 'src/utils/api/client';
import { PrimaryButton } from 'src/theme/buttons';

const ApplicationBootstrap = ({ children }) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);
  const [, setCurrentApplication] = useCurrentApplication();
  const { setApplications } = useApplicationManagement();
  const queryClient = useRef(new Client({ http: mainChainNetwork?.serviceUrl }));
  useTransactionUpdate();

  const {
    data: selectedNetworkStatus,
    isLoading: isGettingNetworkStatus,
    isError: isErrorGettingNetworkStatus,
  } = useNetworkStatus({
    options: { enabled: !!mainChainNetwork },
    client: queryClient.current,
  });

  // const {
  //   data: mainChainApplication,
  //   isLoading: isGettingMainChain,
  //   isError: isErrorGettingMainChain,
  //   refetch: refetchMergedApplicationData,
  // } = useGetMergedApplication({
  //   params: { chainID: selectedNetworkStatus?.data?.chainId },
  //   networkName: mainChainNetwork?.name,
  //   isEnabled: !!selectedNetworkStatus,
  // });

  const {
    data,
    isLoading: isGettingMainChain,
    isError: isErrorGettingMainChain,
    refetch: refetchMergedApplicationData,
  } = useBlockchainApplicationMeta({
    config: {
      params: {
        chainID: selectedNetworkStatus?.data?.chainID,
        network: mainChainNetwork?.name,
      },
    },
    options: { enabled: !!selectedNetworkStatus && !!mainChainNetwork },
    client: queryClient.current,
  });

  const mainChainApplication = data?.data?.find(
    ({ chainID }) => chainID === selectedNetworkStatus?.data?.chainID
  );

  const isError = (isErrorGettingNetworkStatus || isErrorGettingMainChain) && !!mainChainNetwork;
  const isLoading =
    (isGettingNetworkStatus && !!mainChainNetwork) ||
    (isGettingMainChain && !!mainChainApplication);

  useEffect(() => {
    if (mainChainApplication) {
      setCurrentApplication(mainChainApplication);
      setApplications(data?.data || []);
    }
    if (isFirstTimeLoading) setIsFirstTimeLoading(false);
  }, [mainChainApplication, isFirstTimeLoading]);

  if (isError && !isLoading && isFirstTimeLoading) {
    // @TODO: this return should be replaced with an actual error message page
    return (
      <div>
        error
        <PrimaryButton onClick={refetchMergedApplicationData}>Retry</PrimaryButton>
      </div>
    );
  }

  return !isLoading || !isFirstTimeLoading ? children : null;
};

export default ApplicationBootstrap;
