import { useMemo } from 'react';
import { useAuth } from '@auth/hooks/queries';
import { extractAddressFromPublicKey } from '@wallet/utils/account';

const useTxInitiatorAccount = ({ transactionJSON }) => {
  const txInitiatorAddress = extractAddressFromPublicKey(transactionJSON.senderPublicKey);

  const { data, isLoading } = useAuth({
    config: { params: { address: txInitiatorAddress } },
  });

  const txInitiatorAccount = useMemo(
    () => ({
      ...(data?.data || {}),
      ...(data?.meta || {}),
      keys: {
        ...(data?.data || { mandatoryKeys: [], optionalKeys: [] }),
      },
    }),
    [isLoading]
  );

  return { txInitiatorAccount, isLoading };
};

export default useTxInitiatorAccount;
