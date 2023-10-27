import { useCallback, useEffect, useState } from 'react';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import { useAuth } from './queries';

// eslint-disable-next-line max-statements
const useNonceSync = () => {
  const { setNonceByAccount, getNonceByAccount, resetNonceByAccount } = useAccounts();
  const [currentAccount] = useCurrentAccount();
  const currentAccountAddress = currentAccount.metadata.address;
  const currentAccountNonce = getNonceByAccount(currentAccountAddress);

  const { data: authData } = useAuth({
    config: { params: { address: currentAccountAddress } },
  });
  const onChainNonce = authData?.data?.nonce ? BigInt(authData?.data.nonce) : BigInt('0');

  const [accountNonce, setAccountNonce] = useState(onChainNonce.toString());
  const authNonce = typeof onChainNonce === 'bigint' ? onChainNonce.toString() : onChainNonce;

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
    resetNonceByAccount(currentAccountAddress, authNonce);
  };

  return { accountNonce, onChainNonce: authNonce, incrementNonce, resetNonce };
};

export default useNonceSync;
