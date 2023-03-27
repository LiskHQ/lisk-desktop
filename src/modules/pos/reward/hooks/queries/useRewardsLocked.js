import { POS_REWARDS_LOCKED } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from '@common/hooks';

/**
 * Creates a custom hook to fetch claimable rewards by address
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} [configuration.config.params.address] - account address
 * @param {string} [configuration.config.params.publicKey] - publicKey
 * @param {string} [configuration.config.params.name] - name
 * @param {string} [configuration.config.params.limit] - limit
 * @param {string} [configuration.config.params.offset] - offset
 * @param {string} [configuration.options] - the query options
 *
 * @returns the query object
 */

export const useRewardsLocked = ({ config: customConfig = {}, options } = {}) => {
  const hasRequiredParams =
    customConfig.params?.address || customConfig.params?.name || customConfig.params?.publicKey;

  const config = {
    url: `/api/${API_VERSION}/pos/rewards/locked`,
    method: 'get',
    event: 'get.pos.rewards.locked',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [POS_REWARDS_LOCKED],
    config,
    options: {
      ...options,
      enabled: !!hasRequiredParams,
    },
  });
};
