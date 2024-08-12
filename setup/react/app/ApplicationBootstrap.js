/* eslint-disable complexity */
/* eslint-disable max-statements */
import React, { createContext } from 'react';
import { useCurrentAccount } from 'src/modules/account/hooks';
import { useCurrentApplication } from 'src/modules/blockchainApplication/manage/hooks';
import { useReduxStateModifier } from 'src/utils/useReduxStateModifier';
import { useLedgerDeviceListener } from '@libs/hardwareWallet/ledger/ledgerDeviceListener/useLedgerDeviceListener';
import { useRewardsClaimable } from 'src/modules/pos/reward/hooks/queries';
import { liskMainnetApplication } from 'src/modules/blockchainApplication/manage/const/liskApplications';

export const ApplicationBootstrapContext = createContext({
  hasNetworkError: false,
  isLoadingNetwork: false,
  error: {},
  refetchNetwork: () => {},
  appEvents: { transactions: { rewards: {} } },
});

const ApplicationBootstrap = ({ children }) => {
  const [currentAccount] = useCurrentAccount();
  const accountAddress = currentAccount?.metadata?.address;
  const [currentApplication, setCurrentApplication] = useCurrentApplication();
  if (!Object.keys(currentApplication).length) {
    setCurrentApplication(liskMainnetApplication['00000000']);
  }

  useLedgerDeviceListener();
  useReduxStateModifier();
  const { data: rewardsData } = useRewardsClaimable({
    config: { params: { address: accountAddress } },
    options: { enabled: !!accountAddress, refetchInterval: 300000 },
  });

  return (
    <ApplicationBootstrapContext.Provider
      value={{
        queryClient: {},
        hasNetworkError: false,
        isLoadingNetwork: false,
        indexStatus: {},
        error: null,
        refetchNetwork: false,
        appEvents: { transactions: { rewards: rewardsData?.data ?? [] } },
      }}
    >
      {children}
    </ApplicationBootstrapContext.Provider>
  );
};

export default ApplicationBootstrap;
