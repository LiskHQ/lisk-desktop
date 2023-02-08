import { useAuth } from 'src/modules/auth/hooks/queries';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';

const useCheckInitializedAccount = (address) => {
  const { data: tokens, isSuccess: isSuccessTokens } = useTokensBalance({
    config: { params: { address } },
  });
  const { data: auth, isSuccess: isSuccessAuth } = useAuth({ config: { params: { address } } });
  const isSuccess = isSuccessTokens && isSuccessAuth;
  const balanceCheck = parseInt(tokens?.data?.[0].availableBalance ?? 0, 10) > 0;
  const nonceCheck = parseInt(auth?.data.nonce ?? 0, 10) > 0;
  return isSuccess ? balanceCheck || nonceCheck : false;
};

export default useCheckInitializedAccount;
