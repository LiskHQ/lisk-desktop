import { useMemo } from 'react';
import { useAuth } from '@auth/hooks/queries';
import { extractAddressFromPublicKey } from '@wallet/utils/account';

const useTxInitiatorAccount = ({ senderPublicKey }) => {
  const txInitiatorAddress = extractAddressFromPublicKey(senderPublicKey);

  const { data, isLoading } = useAuth({
    config: { params: { address: txInitiatorAddress } },
  });

  const txInitiatorAccount = useMemo(
    () => ({
      ...(data?.data ?? {}),
      ...(data?.meta ?? {}),
      keys: {
        ...(data?.data ?? { mandatoryKeys: [], optionalKeys: [] }),
      },
      summary: {
        ...(data?.meta?.summary ?? {}),
        publicKey: senderPublicKey,
      },
    }),
    [isLoading]
  );

  return { txInitiatorAccount, isLoading };
};

export default useTxInitiatorAccount;
