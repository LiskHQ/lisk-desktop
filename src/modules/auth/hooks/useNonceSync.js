import { useCallback, useMemo } from 'react';
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
  const currentAccountNonce = getNonceByAccount(currentAccount.metadata.address);
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const chainID = currentApplication.chainID;
  const address = currentAccount.metadata.address;
  const customConfig = {
    params: {
      address,
    },
  };
  const baseUrl = mainChainNetwork?.serviceUrl;
  const config = useAuthConfig(customConfig);
  const authData = queryClient.getQueryData([AUTH, chainID, config, baseUrl]);
  const onChainNonce = authData?.data.nonce;

  // Store nonce by address in account
  const handleLocalNonce = useCallback((currentNonce) => {
    let localNonce = parseInt(currentAccountNonce ?? 0, 10);
    if (localNonce < currentNonce) {
      localNonce = currentNonce;
    }
    setNonceByAccount(currentAccount.metadata.address, localNonce);

    return localNonce;
  }, []);

  // Call incrementNonce after transaction signing
  const incrementNonce = useCallback(() => {
    let localNonce = currentAccountNonce ?? 0;
    localNonce += 1;
    setNonceByAccount(currentAccount.metadata.address, localNonce);
  }, []);

  const accountNonce = useMemo(() => handleLocalNonce(parseInt(onChainNonce, 10)), [onChainNonce]);

  return { accountNonce, incrementNonce };
};

export default useNonceSync;
