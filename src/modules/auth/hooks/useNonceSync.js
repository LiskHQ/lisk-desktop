import { useCallback, useEffect, useState } from 'react';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useAuth } from './queries';

// eslint-disable-next-line max-statements
const useNonceSync = () => {
  const { setNonceByAccount, getNonceByAccount, resetNonceByAccount } = useAccounts();
  const [{ chainID, chainName }] = useCurrentApplication();
  const networkChainIDKey = `${chainName}:${chainID}`;
  const [currentAccount] = useCurrentAccount();
  const currentAccountAddress = currentAccount.metadata.address;

  const { data: authData } = useAuth({
    config: { params: { address: currentAccountAddress } },
  });
  const onChainNonce = authData?.data?.nonce ? BigInt(authData?.data.nonce) : BigInt('0');

  const [accountNonce, setAccountNonce] = useState(onChainNonce.toString());
  /* istanbul ignore next */
  const authNonce = typeof onChainNonce === 'bigint' ? onChainNonce.toString() : onChainNonce;
  const isMultiSig = authData?.data?.numberOfSignatures > 0;

  // Store nonce by address in accounts store
  /* istanbul ignore next */
  const handleLocalNonce = (currentNonce) => {
    const currentAccountNonce = getNonceByAccount(currentAccountAddress, networkChainIDKey);
    const storedNonce = BigInt(currentAccountNonce || 0);
    const localNonce = storedNonce < currentNonce ? currentNonce : storedNonce;
    const localNonceStr = localNonce.toString();
    setNonceByAccount(currentAccountAddress, localNonceStr, 'defaultNonce', networkChainIDKey);

    setAccountNonce(localNonceStr);
  };

  useEffect(() => {
    if (isMultiSig) {
      handleLocalNonce(onChainNonce);
    }
  }, [onChainNonce, isMultiSig, networkChainIDKey]);

  // Increment nonce after transaction signing
  const incrementNonce = useCallback(
    (transactionHex) => {
      if (isMultiSig) {
        const currentAccountNonce = getNonceByAccount(currentAccountAddress, networkChainIDKey);
        const localNonce = BigInt(Math.max(currentAccountNonce, Number(accountNonce))) + BigInt(1);
        setNonceByAccount(currentAccountAddress, localNonce.toString(), transactionHex, networkChainIDKey);
      }
    },
    [isMultiSig, networkChainIDKey]
  );

  const resetNonce = () => {
    if (isMultiSig) {
      resetNonceByAccount(currentAccountAddress, authNonce, networkChainIDKey);
    }
  };

  if (isMultiSig) {
    return { accountNonce, onChainNonce: authNonce, incrementNonce, resetNonce };
  }

  return { accountNonce: authNonce, onChainNonce: authNonce, incrementNonce, resetNonce };
};

export default useNonceSync;
