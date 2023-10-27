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
  const isMultiSig = authData?.data?.numberOfSignatures > 0;

  // Store nonce by address in accounts store
  const handleLocalNonce = (currentNonce) => {
    const storedNonce = BigInt(currentAccountNonce || 0);
    const localNonce = storedNonce < currentNonce ? currentNonce : storedNonce;
    const localNonceStr = localNonce.toString();
    setNonceByAccount(currentAccountAddress, localNonceStr, 'defaultNonce');

    setAccountNonce(localNonceStr);
  };

  useEffect(() => {
    if (isMultiSig) {
      handleLocalNonce(onChainNonce);
    }
  }, [onChainNonce, isMultiSig]);

  // Increment nonce after transaction signing
  const incrementNonce = useCallback(
    (transactionHex) => {
      if (isMultiSig) {
        const localNonce = BigInt(Math.max(currentAccountNonce, Number(accountNonce))) + BigInt(1);
        setNonceByAccount(currentAccountAddress, localNonce.toString(), transactionHex);
      }
    },
    [isMultiSig]
  );

  const resetNonce = () => {
    if (isMultiSig) {
      resetNonceByAccount(currentAccountAddress, authNonce);
    }
  };

  if (isMultiSig) {
    return { accountNonce, onChainNonce: authNonce, incrementNonce, resetNonce };
  }

  return { accountNonce: authNonce, onChainNonce: authNonce, incrementNonce, resetNonce };
};

export default useNonceSync;
