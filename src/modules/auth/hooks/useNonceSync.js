import { useEffect, useState, useCallback } from 'react';
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
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const chainID = currentApplication.chainID;
  const customConfig = {
    params: {
      address: currentAccountAddress,
    },
  };
  const serviceUrl = mainChainNetwork?.serviceUrl;
  const config = useAuthConfig(customConfig);
  const authData = queryClient.getQueryData([AUTH, chainID, config, serviceUrl]);
  const onChainNonce = BigInt(authData?.data.nonce || 0);

  const [accountNonce, setAccountNonce] = useState(onChainNonce);
  const currentAccountNonce = getNonceByAccount(currentAccountAddress);

  // Store nonce by address in accounts store
  const handleLocalNonce = (currentNonce) => {
    const storedNonce = BigInt(currentAccountNonce || 0);
    const localNonce = accountNonce < currentNonce ? currentNonce : storedNonce;
    setNonceByAccount(currentAccountAddress, localNonce.toString());

    setAccountNonce(localNonce.toString());
  };

  useEffect(() => {
    handleLocalNonce(onChainNonce);
  }, [onChainNonce]);

  // Call incrementNonce after transaction signing
  const incrementNonce = useCallback(() => {
    const localNonce = BigInt(currentAccountNonce) + BigInt(1);
    setNonceByAccount(currentAccountAddress, localNonce.toString());
  }, []);

  return { accountNonce, onChainNonce, incrementNonce };
};

export default useNonceSync;
