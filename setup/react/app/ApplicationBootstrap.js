/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { useEffect, useState } from 'react';
import { useTransactionUpdate } from '@transaction/hooks';
import useSettings from '@settings/hooks/useSettings';
import { useGetMergedApplication } from '@blockchainApplication/manage/hooks/useGetMergedApplication';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useGetNetworksMainChainStatus } from '@blockchainApplication/manage/hooks/queries/useGetNetworksMainChainStatus';
import { PrimaryButton } from 'src/theme/buttons';

const ApplicationBootstrap = ({ children }) => {
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);
  const [, setCurrentApplication] = useCurrentApplication();
  useTransactionUpdate();

  const {
    data: networksMainChainStatus,
    isLoading: isVerifyingNetworkOptions,
    isError: isErrorVerifyingNetworkOptions,
  } = useGetNetworksMainChainStatus({ options: { enabled: !!mainChainNetwork } });

  const selectedNetworkMainChain = networksMainChainStatus[mainChainNetwork?.name];

  const {
    data: mainChainApplication,
    isLoading: isGettingMainChain,
    isError: isErrorGettingMainChain,
    refetch: refetchMergedApplicationData,
  } = useGetMergedApplication({
    params: { chainID: selectedNetworkMainChain?.data?.chainID },
    networkName: mainChainNetwork?.name,
    isEnabled: !!selectedNetworkMainChain,
  });

  const isError = (isErrorVerifyingNetworkOptions || isErrorGettingMainChain) && !!mainChainNetwork;
  const isLoading =
    (isVerifyingNetworkOptions && !!mainChainNetwork) ||
    (isGettingMainChain && !!selectedNetworkMainChain);

  useEffect(() => {
    if (mainChainApplication) {
      setCurrentApplication(mainChainApplication);
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
