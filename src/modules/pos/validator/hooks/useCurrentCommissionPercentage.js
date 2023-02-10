import  { useMemo } from 'react';
import { convertCommissionToPercentage } from '@pos/validator/utils';
import { useCurrentAccount } from '@account/hooks';
import { useValidators } from '@pos/validator/hooks/queries';

export const useCurrentCommissionPercentage = (address) => {
  const [currentAccount] = useCurrentAccount();
  const config = { params: { address: address ?? currentAccount?.metadata?.address } };
  const { data,  ...others } = useValidators({ config });
  const currentCommission = useMemo(() => convertCommissionToPercentage(data?.data[0].commission), [data]);

  return {
    ...others,
    currentCommission,
  };
};
