import { useMemo } from 'react';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
import { usePosConstants } from './queries';

const usePosToken = ({ address } = {}) => {
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  const { data: tokens, isLoading: isLoadingTokenBalance } = useTokensBalance({
    config: { params: { tokenID: posConstants?.data?.posTokenID, address } },
    options: { enabled: !isGettingPosConstants },
  });

  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  return { token, isLoading: isGettingPosConstants || isLoadingTokenBalance };
};

export default usePosToken;
