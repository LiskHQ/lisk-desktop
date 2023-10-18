import { useEffect, useState, useCallback /* useMemo */ } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useCurrentAccount, useAccounts } from '@account/hooks';
import useSettings from '@settings/hooks/useSettings';
import { AUTH } from 'src/const/queries';
import { useAuthConfig } from './queries';

// eslint-disable-next-line max-statements
const useNonceSync = () => {
  const queryClient = useQueryClient();
  const [currentApplication] = useCurrentApplication();
  const [currentAccount] = useCurrentAccount();
  const { setNonceByAccount, getNonceByAccount } = useAccounts();
  const currentAccountAddress = currentAccount.metadata.address;
  const currentAccountNonce = getNonceByAccount(currentAccountAddress);
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const chainID = currentApplication.chainID;
  const customConfig = {
    params: {
      address: currentAccountAddress,
    },
  };
  const baseUrl = mainChainNetwork?.serviceUrl;
  const config = useAuthConfig(customConfig);
  const authData = queryClient.getQueryData([AUTH, chainID, config, baseUrl]);
  const onChainNonce = authData?.data.nonce;
  const [accountNonce, setAccountNonce] = useState(onChainNonce);

  // Store nonce by address in account
  const handleLocalNonce = (currentNonce) => {
    let localNonce = parseInt(currentAccountNonce ?? 0, 10);
    if (localNonce < currentNonce) {
      localNonce = currentNonce;
    }
    setNonceByAccount(currentAccountAddress, localNonce);

    setAccountNonce(localNonce);
  };

  useEffect(() => {
    handleLocalNonce(parseInt(onChainNonce, 10));
  }, [onChainNonce]);

  // Call incrementNonce after transaction signing
  const incrementNonce = useCallback(() => {
    let localNonce = currentAccountNonce ?? 0;
    localNonce += 1;
    setNonceByAccount(currentAccountAddress, localNonce);
  }, []);

  return { accountNonce, onChainNonce, incrementNonce };
};

export default useNonceSync;
