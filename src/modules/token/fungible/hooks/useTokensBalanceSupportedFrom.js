import { useMemo, useRef } from 'react';
import { useTokensBalance, useTokensSupported } from '@token/fungible/hooks/queries';
import {Client} from 'src/utils/api/client';

// eslint-disable-next-line import/prefer-default-export
export const useApplicationSupportedTokens = (application) => {
  const client = useRef(new Client())
  if(application?.apis?.length) {
    client.current.create(application.apis[0])
  }

  const { data: { data: myTokens = [] } = {}, isSuccess: isTokensSuccess } = useTokensBalance();
  const { data: { data: { supportedTokens = [] } = {} } = {}, isSuccess: isSupportedSuccess } = useTokensSupported({client: client.current});
  const isSuccess = isTokensSuccess && isSupportedSuccess
  const tokens = useMemo(
    () =>{
      const isSupportAllToken = supportedTokens.length === 0
      return isSupportAllToken ? myTokens :
        myTokens.filter(
          (token) =>
            supportedTokens.find((supportedToken) => supportedToken.symbol === token.symbol).length
        )
    },
    [isTokensSuccess, isSupportedSuccess]
  );
  return isSuccess ? tokens : [];
};
