import defaultClient from 'src/utils/api/client';
import { API_VERSION } from 'src/const/config';

export const getCheckInitializedAccount = async (address, tokenID) => {
  const config = {
    data: {
      endpoint: 'token_hasUserAccount',
      params: { address, tokenID },
    },
  };
  const res = await defaultClient.call({
    url: `/api/${API_VERSION}/invoke`,
    method: 'post',
    event: 'post.invoke',
    ...config,
  });

  return res?.data?.exists;
};
