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
  const { setNonceByAccount, getNonceByAccount, resetNonceByAccount } = useAccounts();
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
  const onChainNonce = authData?.data?.nonce ? BigInt(authData?.data.nonce) : BigInt('0');
  const authNonce = typeof onChainNonce === 'bigint' ? onChainNonce.toString() : onChainNonce;

  const [accountNonce, setAccountNonce] = useState(onChainNonce.toString());
  const currentAccountNonce = getNonceByAccount(currentAccountAddress);

  // Store nonce by address in accounts store
  const handleLocalNonce = (currentNonce) => {
    const storedNonce = BigInt(currentAccountNonce || 0);
    const localNonce = storedNonce < currentNonce ? currentNonce : storedNonce;
    const localNonceStr = localNonce.toString();
    setNonceByAccount(currentAccountAddress, localNonceStr, 'defaultNonce');

    setAccountNonce(localNonceStr);
  };

  useEffect(() => {
    handleLocalNonce(onChainNonce);
  }, [onChainNonce]);

  // Increment nonce after transaction signing
  const incrementNonce = useCallback((transactionHex) => {
    const localNonce = BigInt(Math.max(currentAccountNonce, Number(accountNonce))) + BigInt(1);
    setNonceByAccount(currentAccountAddress, localNonce.toString(), transactionHex);
  }, []);

  const resetNonce = () => {
    resetNonceByAccount(currentAccountAddress);
    setNonceByAccount(currentAccountAddress, onChainNonce, 'defaultNonce');
  };

  return { accountNonce, onChainNonce: authNonce, incrementNonce, resetNonce };
};

export default useNonceSync;
