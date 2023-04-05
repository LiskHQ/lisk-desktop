import { useMemo } from 'react';
import { useCurrentAccount } from 'src/modules/account/hooks';
import { useTokenBalances } from 'src/modules/token/fungible/hooks/queries';
import { usePosConstants } from './queries';

const usePosToken = (props) => {
  const [currentAccount] = useCurrentAccount();
  const { address } = props || currentAccount.metadata || {};
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  const { data: tokens, isLoading: isLoadingTokenBalance } = useTokenBalances({
    config: { params: { tokenID: posConstants?.data?.posTokenID, address } },
    options: { enabled: !isGettingPosConstants },
  });

  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  return { token, isLoading: isGettingPosConstants || isLoadingTokenBalance };
};

export default usePosToken;
