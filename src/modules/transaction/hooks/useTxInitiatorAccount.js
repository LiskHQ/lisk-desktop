import { useMemo } from 'react';
import { useAuth } from 'src/modules/auth/hooks/queries';
import { extractAddressFromPublicKey } from 'src/modules/wallet/utils/account';

const useTxInitatorAccount = ({ transactionJSON }) => {
  const txInitatorAddress = extractAddressFromPublicKey(transactionJSON.senderPublicKey);

  const { data, isLoading } = useAuth({
    config: { params: { address: txInitatorAddress } },
  });

  const txInitatorAccount = useMemo(
    () => ({
      ...(data?.data || {}),
      ...(data?.meta || {}),
      keys: {
        ...(data?.data || { mandatoryKeys: [], optionalKeys: [] }),
      },
    }),
    [isLoading]
  );

  return { txInitatorAccount, isLoading };
};

export default useTxInitatorAccount;
