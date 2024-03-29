import { POS_REWARDS_CLAIMABLE } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from '@common/hooks';
import { useAppsMetaTokensConfig } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import defaultClient from 'src/utils/api/client';
import { addTokensMetaData } from '@token/fungible/utils/addTokensMetaData';

/**
 * Creates a custom hook to fetch claimable rewards by address
 *
 * @returns the query object
 */

export const useRewardsClaimable = ({ config: customConfig = {}, options } = {}) => {
  const hasRequiredParams =
    customConfig.params?.address || customConfig.params?.name || customConfig.params?.publicKey;

  const createMetaConfig = useAppsMetaTokensConfig();
  const transformToken = addTokensMetaData({ createMetaConfig, client: defaultClient });

  const transformResult = async (res) => {
    const tokens = await transformToken(res.data);
    const rewardsWithToken = res.data?.map((rewardsClaimable) => {
      const token = tokens.find((metaToken) => metaToken.tokenID === rewardsClaimable.tokenID);

      return {
        ...rewardsClaimable,
        ...token,
      };
    });
    return {
      ...res,
      data: rewardsWithToken,
    };
  };

  const config = {
    url: `/api/${API_VERSION}/pos/rewards/claimable`,
    method: 'get',
    event: 'get.pos.rewards.claimable',
    transformResult,
    ...customConfig,
  };

  return useCustomQuery({
    keys: [POS_REWARDS_CLAIMABLE],
    config,
    options: {
      ...options,
      enabled: !!hasRequiredParams && options?.enabled !== false,
    },
  });
};
